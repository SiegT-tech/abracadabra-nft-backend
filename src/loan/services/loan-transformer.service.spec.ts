import { Test } from '@nestjs/testing';

import { Networks } from '../../blockchain/constants';

import { LoanTransformerService } from './loan-transformer.service';

import { LoanEntity, LoanStatus } from '../dao/loan.entity';

describe('LoanTransformerService', () => {
    let loanTransformerService: LoanTransformerService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [LoanTransformerService],
        }).compile();

        loanTransformerService = moduleRef.get(LoanTransformerService);
    });

    describe('toLoan', () => {
        const loanMock = {
            id: 'id',
            network: Networks.MAINNET,
            status: LoanStatus.LOAN_INITIAL,
            startTime: 0,
            duration: 0,
            valuation: 0,
            annualInterestBPS: 0,
            borrower: 'borrower',
            lender: 'lender',
        } as LoanEntity;

        it('should return loan', () => {
            const actual = loanTransformerService.toLoan(loanMock);
            expect(actual).toEqual(Object.assign(loanMock, { isExpired: true }));
        });
    });
});
