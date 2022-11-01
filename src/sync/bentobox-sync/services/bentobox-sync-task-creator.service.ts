import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { BentoboxEntityService } from '../../../common/db/bentobox-entity/services/bentobox-entity.service';
import { availableNetworks } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { cronTimes } from '../../../env';

import { BentoboxSyncTaskService } from './bentobox-sync-task.service';

@Injectable()
export class BentoboxSyncTaskCreatorService {
    constructor(
        private readonly bentoboxSyncTaskService: BentoboxSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly bentoboxEntityService: BentoboxEntityService,
    ) {}

    @Cron(cronTimes.bentobox.sync)
    public async createTasks(): Promise<void> {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const bentoboxs = await this.bentoboxEntityService.read({ network });

            for (const bentobox of bentoboxs) {
                await this.bentoboxSyncTaskService.syncTask(bentobox, currentBlock);
            }
        }
    }
}
