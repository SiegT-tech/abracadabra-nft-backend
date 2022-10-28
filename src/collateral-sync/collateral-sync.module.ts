import { Module } from '@nestjs/common';

import { CollateralSyncTaskCreatorService } from './services/collateral-sync-task-creator.service';
import { CollateralSyncTaskService } from './services/collateral-sync-task.service';
import { CollateralSyncUtilsService } from './services/collateral-sync-utils.service';
import { CollateralSyncService } from './services/collateral-sync.service';

@Module({
    providers: [CollateralSyncTaskCreatorService, CollateralSyncTaskService, CollateralSyncService, CollateralSyncUtilsService],
})
export class CollateralSyncModule {}
