import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { Networks } from '../../blockchain/constants';

import { CollateralBlockchainService } from './collateral-blockchain.service';
import { CollateralService } from './collateral.service';

import { CollateralEntity } from '../dao/collateral.entity';

@Injectable()
export class CollateralHelpersService {
    constructor(private readonly collateralService: CollateralService, private readonly collateralBlockchainService: CollateralBlockchainService) {}

    public async findOrCreateCollateral(network: Networks, address: string): Promise<CollateralEntity> {
        let collateral = await this.collateralService.readOne({ network, address: ILike(`%${address}%`) });
        if (!collateral) {
            const _collateral = await this.collateralBlockchainService.getCollateral(network, address);
            collateral = await this.collateralService.create({ ..._collateral, canSync: false });
        }
        return collateral;
    }
}
