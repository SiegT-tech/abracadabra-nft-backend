import { IPagination } from '../../common/interfaces/pagination.interface';

import { CollateralEntity } from '../dao/collateral.entity';

export interface CollateralWithPagination {
    collaterals: CollateralEntity[];
    pagination: IPagination;
}
