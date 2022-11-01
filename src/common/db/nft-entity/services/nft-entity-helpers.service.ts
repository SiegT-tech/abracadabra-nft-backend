import { Injectable } from '@nestjs/common';

import { BlockchainHelpersService } from '../../../modules/blockchain/services/blockchain-helpers.service';
import { CollateralEntity } from '../../collateral-entity/dao/collateral.entity';

import { NftEntityService } from './nft-entity.service';

import { NftEntity } from '../dao/nft.entity';

@Injectable()
export class NftHelpersEntityService {
    constructor(private readonly nftEntityService: NftEntityService, private readonly blockchainHelpersService: BlockchainHelpersService) {}

    public async findOrCreateNft(collateral: CollateralEntity, tokenId: number, owner?: string): Promise<NftEntity> {
        let nft = await this.nftEntityService.readOne({ collateral, tokenId });
        if (!nft) {
            const _nft = await this.blockchainHelpersService.getNft(collateral, tokenId, owner);
            nft = await this.nftEntityService.create(_nft);
        }
        return nft;
    }
}
