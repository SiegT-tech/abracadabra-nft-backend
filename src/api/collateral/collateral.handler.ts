import { Injectable } from '@nestjs/common';
import { from, map, mergeMap } from 'rxjs';

import { CollateralEntityService } from '../../common/db/collateral-entity/services/collateral-entity.service';

import { GetCauldronsDto } from './dto/get-collaterals.dto';
import { CollateralTransformerService } from './services/collateral-transformer.service';

@Injectable()
export class CollateralHandler {
    constructor(private readonly collateralEntityService: CollateralEntityService, private readonly collateralTransformerService: CollateralTransformerService) {}

    public getCollaterals({ filters, pagination }: GetCauldronsDto) {
        return this.collateralEntityService.getCollaterals(filters, pagination).pipe(mergeMap(data => this.collateralTransformerService.toCollateralWithPagination(data)));
    }

    public getCollateralList() {
        return this.collateralEntityService.getCollateralList().pipe(map(data => ({ collaterals: data.map(data => this.collateralTransformerService.toCollateralList(data)) })));
    }

    public getCollateral(id: string) {
        return from(this.collateralEntityService.readOneOrFaild({ id })).pipe(
            mergeMap(async collateral => ({ collateral: await this.collateralTransformerService.toCollateral(collateral) })),
        );
    }
}
