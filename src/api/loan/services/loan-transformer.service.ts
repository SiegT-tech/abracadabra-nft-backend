import { Injectable } from '@nestjs/common';

import { LoanEntity } from '../../../common/db/loan-entity/dao/loan.entity';
import { getTimeNowSec } from '../../../utils';

@Injectable()
export class LoanTransformerService {
    public toLoan({ id, network, status, startTime, duration, valuation, annualInterestBPS, borrower, lender, cauldron, ltvBPS, oracle }: LoanEntity) {
        const now = getTimeNowSec();

        const loan = {
            id,
            network,
            status,
            startTime,
            duration,
            valuation,
            annualInterestBPS,
            borrower,
            lender,
            isExpired: now > startTime + duration,
            cauldronId: undefined,
            ltvBPS,
            oracle,
        };

        if (cauldron) {
            loan.cauldronId = cauldron.id;
        }

        return loan;
    }
}
