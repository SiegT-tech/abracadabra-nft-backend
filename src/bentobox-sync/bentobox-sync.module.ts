import { Module, Global } from '@nestjs/common';

import { BentoboxSyncTaskCreatorService } from './services/bentobox-sync-task-creator.service';
import { BentoboxSyncTaskService } from './services/bentobox-sync-task.service';
import { BentoboxSyncUtilsService } from './services/bentobox-sync-utils.service';
import { BentoboxSyncService } from './services/bentobox-sync.service';

@Global()
@Module({
    providers: [BentoboxSyncUtilsService, BentoboxSyncService, BentoboxSyncTaskService, BentoboxSyncTaskCreatorService],
})
export class BentoboxSyncModule {}
