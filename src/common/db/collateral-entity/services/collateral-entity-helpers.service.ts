import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { Networks } from '../../../modules/blockchain/constants';
import { BlockchainHelpersService } from '../../../modules/blockchain/services/blockchain-helpers.service';

import { CollateralEntityService } from './collateral-entity.service';

import { CollateralEntity } from '../dao/collateral.entity';

@Injectable()
export class CollateralEntityHelpersService {
    constructor(private readonly collateralEntityService: CollateralEntityService, private readonly blockchainHelpersService: BlockchainHelpersService) {}

    public async findOrCreateCollateral(network: Networks, address: string): Promise<CollateralEntity> {
        let collateral = await this.collateralEntityService.readOne({ network, address: ILike(`%${address}%`) });
        if (!collateral) {
            const _collateral = await this.blockchainHelpersService.getCollateral(network, address);
            collateral = await this.collateralEntityService.create({ ..._collateral, canSync: false });
        }
        return collateral;
    }
}
