import { Injectable } from '@nestjs/common';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CollateralEntity } from '../../collateral/dao/collateral.entity';
import { LoggerService } from '../../logger/logger.service';

import { NftAttributesHelpersService } from './nft-attributes-helpers.service';
import { NftUtilsService } from './nft-utils.service';

import { NftEntity } from '../dao/nft.entity';

@Injectable()
export class NftBlockchainService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly loggerService: LoggerService,
        private readonly nftUtilsService: NftUtilsService,
        private readonly nftAttributesHelpersService: NftAttributesHelpersService,
    ) {}

    public async getNft(collateral: CollateralEntity, tokenId: number, owner = ''): Promise<Partial<NftEntity>> {
        const contract = this.blockchainService.getCollateral(collateral.network, collateral.address);
        const tokenUrl = await contract.tokenURI(tokenId);
        const nft: Partial<NftEntity> = { collateral, tokenId, owner, tokenUrl };

        if (!owner) {
            try {
                nft.owner = await contract.ownerOf(tokenId);
            } catch (err) {
                this.loggerService.error('Error when get ownerOf', { extra: { address: collateral.address, network: collateral.network } });
            }
        }

        try {
            const tokenInfo = await this.nftUtilsService.getTokenInfo(tokenUrl);
            nft.name = tokenInfo.name;
            nft.description = tokenInfo.description;
            nft.image = tokenInfo.image;
            nft.attributes = await this.nftAttributesHelpersService.findOrCreateNftAttributes(collateral, tokenInfo.attributes);
        } catch (err) {
            this.loggerService.error('Error when get tokenInfo', { extra: { address: collateral.address, network: collateral.network, tokenUrl, tokenId } });
        }

        return nft;
    }
}
