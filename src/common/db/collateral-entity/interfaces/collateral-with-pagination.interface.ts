import { IPagination } from '../../../interfaces/pagination.interface';

import { CollateralEntity } from '../dao/collateral.entity';

export interface CollateralWithPagination {
    collaterals: CollateralEntity[];
    pagination: IPagination;
}
