import { Module } from '@nestjs/common';

import { CauldronSyncTaskCreatorService } from './services/cauldron-sync-task-creator.service';
import { CauldronSyncTaskService } from './services/cauldron-sync-task.service';
import { CauldronSyncUtilsService } from './services/cauldron-sync-utils.service';
import { CauldronSyncService } from './services/cauldron-sync.service';

@Module({
    providers: [CauldronSyncTaskCreatorService, CauldronSyncTaskService, CauldronSyncUtilsService, CauldronSyncService],
})
export class CauldronSyncModule {}
