import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { BentoboxService } from '../../bentobox/services/bentobox.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { availableNetworks } from '../../blockchain/constants';
import { cronTimes } from '../../env';

import { BentoboxSyncTaskService } from './bentobox-sync-task.service';

@Injectable()
export class BentoboxSyncTaskCreatorService {
    constructor(
        private readonly bentoboxSyncTaskService: BentoboxSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly bentoboxService: BentoboxService,
    ) {}

    @Cron(cronTimes.bentobox.sync)
    public async createTasks(): Promise<void> {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const bentoboxs = await this.bentoboxService.read({ network });

            for (const bentobox of bentoboxs) {
                await this.bentoboxSyncTaskService.syncTask(bentobox, currentBlock);
            }
        }
    }
}
