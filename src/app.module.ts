import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetModule } from './asset/asset.module';
import { BentoboxSyncModule } from './bentobox-sync/bentobox-sync.module';
import { BentoboxModule } from './bentobox/bentobox.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CauldronSyncModule } from './cauldron-sync/cauldron-sync.module';
import { CauldronModule } from './cauldron/cauldron.module';
import { CollateralSyncModule } from './collateral-sync/collateral-sync.module';
import { CollateralModule } from './collateral/collateral.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { LoanModule } from './loan/loan.module';
import { LoggerModule } from './logger/logger.module';
import { NftModule } from './nft/nft.module';
import { OfferCheckerModule } from './offer-checker/offer-checker.module';
import { OfferModule } from './offer/offer.module';

@Module({
    imports: [
        ExceptionsModule,
        BlockchainModule,
        LoggerModule,
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(),
        CauldronModule,
        CauldronSyncModule,
        CollateralModule,
        CollateralSyncModule,
        BentoboxModule,
        BentoboxSyncModule,
        LoanModule,
        OfferModule,
        OfferCheckerModule,
        AssetModule,
        NftModule,
    ],
})
export class AppModule {}
