import { IPagination } from '../../common/interfaces/pagination.interface';

import { LoanEntity } from '../dao/loan.entity';

export interface LoanWithPagination {
    loans: LoanEntity[];
    pagination: IPagination;
}
