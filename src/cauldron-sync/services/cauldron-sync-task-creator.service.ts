import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { availableNetworks } from '../../blockchain/constants';
import { CauldronService } from '../../cauldron/services/cauldron.service';
import { cronTimes } from '../../env';

import { CauldronSyncTaskService } from './cauldron-sync-task.service';

@Injectable()
export class CauldronSyncTaskCreatorService {
    constructor(
        private readonly cauldronSyncTaskService: CauldronSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly cauldronService: CauldronService,
    ) {}

    @Cron(cronTimes.cauldron.sync)
    public async createTasks() {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const cauldrons = await this.cauldronService.read({ network });

            for (const cauldron of cauldrons) {
                await this.cauldronSyncTaskService.syncTask(cauldron, currentBlock);
            }
        }
    }
}
