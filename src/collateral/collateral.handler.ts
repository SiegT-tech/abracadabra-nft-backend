import { Injectable } from '@nestjs/common';
import { from, map } from 'rxjs';

import { GetCauldronsDto } from './dto/get-collaterals.dto';
import { CollateralTransformerService } from './services/collateral-transformer.service';
import { CollateralService } from './services/collateral.service';

@Injectable()
export class CollateralHandler {
    constructor(private readonly collateralService: CollateralService, private readonly collateralTransformerService: CollateralTransformerService) {}

    public getCollaterals({ filters, pagination }: GetCauldronsDto) {
        return this.collateralService.getCollaterals(filters, pagination).pipe(map(data => this.collateralTransformerService.toCollateralWithPagination(data)));
    }

    public getCollateralList() {
        return this.collateralService.getCollateralList().pipe(map(data => ({ collaterals: data.map(data => this.collateralTransformerService.toCollateralList(data)) })));
    }

    public getCollateral(id: string) {
        return from(this.collateralService.readOneOrFaild({ id })).pipe(map(collateral => ({ collateral: this.collateralTransformerService.toCollateral(collateral) })));
    }
}
