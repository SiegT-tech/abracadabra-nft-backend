import { Injectable } from '@nestjs/common';

import { CollateralEntity } from '../../../db/collateral-entity/dao/collateral.entity';
import { NftEntity } from '../../../db/nft-entity/dao/nft.entity';
import { NftAttributesEntityHelpersService } from '../../../db/nft-entity/services/nft-attributes-entity-helpers.service';

import { BlockchainExplorerApiService } from './blockchain-explorer-api.service';
import { BlockchainExternalApisService } from './blockchain-external-apis.service';
import { BlockchainService } from './blockchain.service';

import { Networks } from '../constants';
import { IAsset } from '../interfaces/asset.interface';

@Injectable()
export class BlockchainHelpersService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly blockchainExplorerApiService: BlockchainExplorerApiService,
        private readonly blockchainExternalApisService: BlockchainExternalApisService,
        private readonly nftAttributesEntityHelpersService: NftAttributesEntityHelpersService,
    ) {}

    public async getNft(collateral: CollateralEntity, tokenId: number, owner = ''): Promise<Partial<NftEntity>> {
        const contract = this.blockchainService.getCollateral(collateral.network, collateral.address);
        const tokenUrl = await contract.tokenURI(tokenId);
        const nft: Partial<NftEntity> = { collateral, tokenId, owner, tokenUrl };

        if (!owner) {
            try {
                nft.owner = await contract.ownerOf(tokenId);
            } catch (err) {}
        }

        try {
            const nftInfo = await this.blockchainExternalApisService.getNftInfo(tokenUrl);
            nft.name = nftInfo.name.trim();
            nft.description = nftInfo.description.trim();
            nft.image = nftInfo.image;
            nft.attributes = await this.nftAttributesEntityHelpersService.findOrCreateNftAttributes(collateral, nftInfo.attributes);
        } catch (err) {}

        return nft;
    }

    public async getAsset(network: Networks, address: string): Promise<IAsset> {
        const token = this.blockchainService.getToken(network, address);
        const asset: IAsset = { network, address, name: 'Unknow', decimals: 0 };
        try {
            asset.name = await token.name();
        } catch (err) {}
        try {
            asset.decimals = await token.decimals();
        } catch (err) {}
        return asset;
    }

    public async getCollateralInfo(collateral: Partial<CollateralEntity>): Promise<Partial<CollateralEntity>> {
        if (collateral.name !== 'Unknow') {
            collateral = await this.blockchainExternalApisService.opensea(collateral);
            collateral = await this.blockchainExternalApisService.coingecko(collateral);
        }

        collateral = await this.blockchainExternalApisService.rarible(collateral);
        return collateral;
    }

    public async getCollateral(network: Networks, address: string): Promise<Partial<CollateralEntity>> {
        const contract = this.blockchainService.getCollateral(network, address);
        let collateral: Partial<CollateralEntity> = { network, address, name: 'Unknow', totalSupply: 0, idsStartFrom: 0, creationBlock: 0 };
        try {
            collateral.name = await contract.name();
        } catch (err) {}
        try {
            collateral.totalSupply = (await contract.totalSupply()).toNumber();
        } catch (err) {}
        try {
            collateral.creationBlock = await this.blockchainExplorerApiService.getContractCreationBlockNumber(network, address);
        } catch (err) {}

        collateral = await this.getCollateralInfo(collateral);

        for (let i = 0; i < collateral.totalSupply || 10; i++) {
            try {
                const owner = await contract.ownerOf(i);
                if (owner) {
                    collateral.idsStartFrom = i;
                    break;
                }
            } catch (err) {}
        }

        return collateral;
    }
}
