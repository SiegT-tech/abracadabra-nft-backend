import { Injectable } from '@nestjs/common';
import { Log, AddressZero } from 'nestjs-ethers';
import { ILike, LessThan } from 'typeorm';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CauldronEvents, TokenLoanParamsWithOracle } from '../../blockchain/constants';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { LoanEntity, LoanStatus } from '../../loan/dao/loan.entity';
import { LoanService } from '../../loan/services/loan.service';
import { NftHelpersService } from '../../nft/services/nft-helpers.service';
import { OfferService } from '../../offer/services/offer.service';

@Injectable()
export class CauldronSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly loanService: LoanService,
        private readonly nftHelpersService: NftHelpersService,
        private readonly offerService: OfferService,
    ) {}

    public async parseLogs(cauldron: CauldronEntity, logs: Log[]): Promise<void> {
        const nftPair = this.blockchainService.getNftPair(cauldron.network, cauldron.address);

        for (const log of logs) {
            const { blockNumber } = log;
            const { name, args } = nftPair.interface.parseLog(log);

            if (name === CauldronEvents.LogRequestLoan) {
                const { borrower, tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersService.findOrCreateNft(cauldron.collateral, Number(tokenId));

                const loan: Partial<LoanEntity> = {
                    borrower,
                    startTime: 0,
                    lender: AddressZero,
                    duration: Number(duration),
                    status: LoanStatus.LOAN_REQUESTED,
                    nft,
                    network: cauldron.network,
                    cauldron,
                    valuation: Number(valuation),
                    annualInterestBPS: Number(annualInterestBPS),
                };

                if (cauldron.oracle) {
                    loan.oracle = oracle;
                    loan.ltvBPS = Number(ltvBPS);
                }

                await this.loanService.create(loan);
            }

            if (name === CauldronEvents.LogUpdateLoanParams) {
                const { tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersService.findOrCreateNft(cauldron.collateral, Number(tokenId));

                const doc: Partial<LoanEntity> = { duration: Number(duration), valuation: Number(valuation), annualInterestBPS: Number(annualInterestBPS) };

                if (cauldron.oracle) {
                    doc.oracle = oracle;
                    doc.ltvBPS = Number(ltvBPS);
                }

                await this.loanService.updateOne({ cauldron, nft }, doc);
            }

            if (name === CauldronEvents.LogRemoveCollateral || name === CauldronEvents.LogRepay) {
                const { tokenId } = args;
                const nft = await this.nftHelpersService.findOrCreateNft(cauldron.collateral, Number(tokenId));

                await this.loanService.delete({ nft, cauldron });
            }

            if (name === CauldronEvents.LogLend) {
                const timestamp = await this.blockchainService.getTimestamp(cauldron.network, blockNumber);
                const { lender, borrower, tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersService.findOrCreateNft(cauldron.collateral, Number(tokenId));
                await this.loanService.delete({ nft, cauldron });

                const loan: Partial<LoanEntity> = {
                    borrower,
                    startTime: timestamp,
                    lender,
                    duration: Number(duration),
                    status: LoanStatus.LOAN_OUTSTANDING,
                    nft,
                    network: cauldron.network,
                    cauldron,
                    valuation: Number(valuation),
                    annualInterestBPS: Number(annualInterestBPS),
                };

                if (cauldron.oracle) {
                    loan.oracle = oracle;
                    loan.ltvBPS = Number(ltvBPS);
                }

                await this.loanService.create(loan);

                const lenderNonce = await nftPair.currentBatchIds(lender);
                const borrowerNonce = await nftPair.currentBatchIds(borrower);

                await this.offerService.delete({ cauldron, address: ILike(`%${lender}%`), nonce: LessThan(lenderNonce.toNumber()) });
                await this.offerService.delete({ cauldron, address: ILike(`%${borrower}%`), nonce: LessThan(borrowerNonce.toNumber()) });
                await this.offerService.delete({ nft });
            }
        }
    }
}
