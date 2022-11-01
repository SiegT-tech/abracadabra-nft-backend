import { IPagination } from '../../../interfaces/pagination.interface';

import { CauldronEntity } from '../dao/cauldron.entity';

export interface CauldronWithPagination {
    cauldrons: CauldronEntity[];
    pagination: IPagination;
}
