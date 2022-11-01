import { Injectable } from '@nestjs/common';
import { Log, AddressZero } from 'nestjs-ethers';
import { ILike, LessThan } from 'typeorm';

import { CauldronEntity } from '../../../common/db/cauldron-entity/dao/cauldron.entity';
import { LoanEntity } from '../../../common/db/loan-entity/dao/loan.entity';
import { LoanEntityService } from '../../../common/db/loan-entity/services/loan-entity.service';
import { LoanStatus } from '../../../common/db/loan-entity/types';
import { NftHelpersEntityService } from '../../../common/db/nft-entity/services/nft-entity-helpers.service';
import { OfferEntityService } from '../../../common/db/offer-entity/services/offer-entity.service';
import { CauldronEvents, TokenLoanParamsWithOracle } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';

@Injectable()
export class CauldronSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly loanEntityService: LoanEntityService,
        private readonly nftHelpersEntityService: NftHelpersEntityService,
        private readonly offerEntityService: OfferEntityService,
    ) {}

    public async parseLogs(cauldron: CauldronEntity, logs: Log[]): Promise<void> {
        const nftPair = this.blockchainService.getNftPair(cauldron.network, cauldron.address);

        for (const log of logs) {
            const { blockNumber } = log;
            const { name, args } = nftPair.interface.parseLog(log);

            if (name === CauldronEvents.LogRequestLoan) {
                const { borrower, tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersEntityService.findOrCreateNft(cauldron.collateral, Number(tokenId));

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

                await this.loanEntityService.create(loan);
            }

            if (name === CauldronEvents.LogUpdateLoanParams) {
                const { tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersEntityService.findOrCreateNft(cauldron.collateral, Number(tokenId));

                const doc: Partial<LoanEntity> = { duration: Number(duration), valuation: Number(valuation), annualInterestBPS: Number(annualInterestBPS) };

                if (cauldron.oracle) {
                    doc.oracle = oracle;
                    doc.ltvBPS = Number(ltvBPS);
                }

                await this.loanEntityService.updateOne({ cauldron, nft }, doc);
            }

            if (name === CauldronEvents.LogRemoveCollateral || name === CauldronEvents.LogRepay) {
                const { tokenId } = args;
                const nft = await this.nftHelpersEntityService.findOrCreateNft(cauldron.collateral, Number(tokenId));

                await this.loanEntityService.delete({ nft, cauldron });
            }

            if (name === CauldronEvents.LogLend) {
                const timestamp = await this.blockchainService.getTimestamp(cauldron.network, blockNumber);
                const { lender, borrower, tokenId, params } = args;
                const { valuation, duration, annualInterestBPS, oracle, ltvBPS }: TokenLoanParamsWithOracle = params;

                const nft = await this.nftHelpersEntityService.findOrCreateNft(cauldron.collateral, Number(tokenId));
                await this.loanEntityService.delete({ nft, cauldron });

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

                await this.loanEntityService.create(loan);

                const lenderNonce = await nftPair.currentBatchIds(lender);
                const borrowerNonce = await nftPair.currentBatchIds(borrower);

                await this.offerEntityService.delete({ cauldron, address: ILike(`%${lender}%`), nonce: LessThan(lenderNonce.toNumber()) });
                await this.offerEntityService.delete({ cauldron, address: ILike(`%${borrower}%`), nonce: LessThan(borrowerNonce.toNumber()) });
                await this.offerEntityService.delete({ nft });
            }
        }
    }
}
