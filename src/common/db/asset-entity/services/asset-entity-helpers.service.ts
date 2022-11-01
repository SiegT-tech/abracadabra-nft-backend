import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { Networks } from '../../../modules/blockchain/constants';
import { BlockchainHelpersService } from '../../../modules/blockchain/services/blockchain-helpers.service';

import { AssetEntityService } from './asset-entity.service';

import { AssetEntity } from '../dao/asset.entity';

@Injectable()
export class AssetEntityHelpersService {
    constructor(private readonly assetEntityService: AssetEntityService, private readonly blockchainHelpersService: BlockchainHelpersService) {}

    public async findOrCreateAsset(network: Networks, address: string): Promise<AssetEntity> {
        let asset = await this.assetEntityService.read({ network, address: ILike(`%${address}%`) });
        if (!asset) {
            const _asset = await this.blockchainHelpersService.getAsset(network, address);
            asset = await this.assetEntityService.create(_asset);
        }
        return asset;
    }
}
