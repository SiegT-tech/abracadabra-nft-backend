import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { Networks } from '../../blockchain/constants';

import { AssetBlockchainService } from './asset-blockchain.service';
import { AssetService } from './asset.service';

import { AssetEntity } from '../dao/asset.entity';

@Injectable()
export class AssetHelpersService {
    constructor(private readonly assetService: AssetService, private readonly assetBlockchainService: AssetBlockchainService) {}

    public async findOrCreateAsset(network: Networks, address: string): Promise<AssetEntity> {
        let asset = await this.assetService.read({ network, address: ILike(`%${address}%`) });
        if (!asset) {
            const token = await this.assetBlockchainService.getAsset(network, address);
            asset = await this.assetService.create(token);
        }
        return asset;
    }
}
