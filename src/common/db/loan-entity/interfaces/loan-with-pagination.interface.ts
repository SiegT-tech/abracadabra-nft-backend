import { IPagination } from '../../../interfaces/pagination.interface';

import { LoanEntity } from '../dao/loan.entity';

export interface LoanWithPagination {
    loans: LoanEntity[];
    pagination: IPagination;
}
