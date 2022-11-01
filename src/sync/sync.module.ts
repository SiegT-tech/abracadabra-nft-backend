import { Module } from '@nestjs/common';

import { BentoboxSyncModule } from './bentobox-sync/bentobox-sync.module';
import { CauldronSyncModule } from './cauldron-sync/cauldron-sync.module';
import { CollateralSyncModule } from './collateral-sync/collateral-sync.module';
import { OfferCheckerModule } from './offer-checker/offer-checker.module';

import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule, OfferCheckerModule, BentoboxSyncModule, CauldronSyncModule, CollateralSyncModule],
})
export class SyncModule {}
