import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { AssetTransformerService } from '../../asset/services/asset-transformer.service';
import { CollateralTransformerService } from '../../collateral/services/collateral-transformer.service';

import { CauldronEntity } from '../dao/cauldron.entity';
import { CauldronWithPagination } from '../interfaces/cauldron-with-pagination.interface';

@Injectable()
export class CauldronTransformService {
    constructor(
        @Inject(forwardRef(() => AssetTransformerService))
        private readonly assetTransformerService: AssetTransformerService,
        @Inject(forwardRef(() => CollateralTransformerService))
        private readonly collateralTransformerService: CollateralTransformerService,
    ) {}

    public toCauldronWithPagination({ cauldrons, pagination }: CauldronWithPagination) {
        return {
            cauldrons: cauldrons.map(pair => this.toCauldron(pair)),
            pagination,
        };
    }

    public toCauldron(cauldron: CauldronEntity) {
        const { id, address, network, masterContract, asset, collateral, deprecated } = cauldron;

        const _cauldron = {
            id,
            address,
            network,
            masterContract,
            asset: undefined,
            collateral: undefined,
            nfts: undefined,
            deprecated,
            oracle: cauldron.oracle,
        };

        if (asset) {
            _cauldron.asset = this.assetTransformerService.toAsset(asset);
        }

        if (collateral) {
            _cauldron.collateral = this.collateralTransformerService.toCollateral(collateral);
        }

        return _cauldron;
    }
}
