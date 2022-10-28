import { IPagination } from '../../common/interfaces/pagination.interface';

import { CauldronEntity } from '../dao/cauldron.entity';

export interface CauldronWithPagination {
    cauldrons: CauldronEntity[];
    pagination: IPagination;
}
