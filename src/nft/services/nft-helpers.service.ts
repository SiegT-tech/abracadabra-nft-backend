import { Injectable } from '@nestjs/common';

import { CollateralEntity } from '../../collateral/dao/collateral.entity';

import { NftBlockchainService } from './nft-blockchain.service';
import { NftEntityService } from './nft-entity.service';
import { NftTransformService } from './nft-transform-service';

import { NftEntity } from '../dao/nft.entity';

@Injectable()
export class NftHelpersService {
    constructor(
        private readonly nftEntityService: NftEntityService,
        private readonly nftBlockchainService: NftBlockchainService,
        private readonly nftTransformService: NftTransformService,
    ) {}

    public async findOrCreateNft(collateral: CollateralEntity, tokenId: number, owner?: string): Promise<NftEntity> {
        let nft = await this.nftEntityService.readOne({ collateral, tokenId });
        if (!nft) {
            const _nft = await this.nftBlockchainService.getNft(collateral, tokenId, owner);
            nft = await this.nftEntityService.create(_nft);
        }
        return nft;
    }

    public async getNftById(collateral: CollateralEntity, tokenId: number) {
        const nft = await this.findOrCreateNft(collateral, tokenId);
        return this.nftTransformService.toNft(nft);
    }
}
