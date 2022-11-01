import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CauldronEntity } from '../../../common/db/cauldron-entity/dao/cauldron.entity';
import { CauldronWithPagination } from '../../../common/db/cauldron-entity/interfaces/cauldron-with-pagination.interface';
import { AssetTransformerService } from '../../asset/services/asset-transformer.service';
import { CollateralTransformerService } from '../../collateral/services/collateral-transformer.service';

@Injectable()
export class CauldronTransformService {
    constructor(
        @Inject(forwardRef(() => AssetTransformerService))
        private readonly assetTransformerService: AssetTransformerService,
        @Inject(forwardRef(() => CollateralTransformerService))
        private readonly collateralTransformerService: CollateralTransformerService,
    ) {}

    public async toCauldronWithPagination({ cauldrons, pagination }: CauldronWithPagination) {
        return {
            cauldrons: await Promise.all(cauldrons.map(pair => this.toCauldron(pair))),
            pagination,
        };
    }

    public async toCauldron(cauldron: CauldronEntity) {
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
            _cauldron.collateral = await this.collateralTransformerService.toCollateral(collateral);
        }

        return _cauldron;
    }
}
