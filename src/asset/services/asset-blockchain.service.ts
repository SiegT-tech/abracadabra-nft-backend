import { Injectable } from '@nestjs/common';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { Networks } from '../../blockchain/constants';

import { IAsset } from '../interfaces/asset.interface';

@Injectable()
export class AssetBlockchainService {
    constructor(private readonly blockchainService: BlockchainService) {}

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
}
