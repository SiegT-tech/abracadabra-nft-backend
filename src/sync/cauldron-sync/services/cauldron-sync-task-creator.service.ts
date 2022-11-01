import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CauldronEntityService } from '../../../common/db/cauldron-entity/services/cauldron-entity.service';
import { availableNetworks } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { cronTimes } from '../../../env';

import { CauldronSyncTaskService } from './cauldron-sync-task.service';

@Injectable()
export class CauldronSyncTaskCreatorService {
    constructor(
        private readonly cauldronSyncTaskService: CauldronSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly cauldronEntityService: CauldronEntityService,
    ) {}

    @Cron(cronTimes.cauldron.sync)
    public async createTasks() {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const cauldrons = await this.cauldronEntityService.read({ network });

            for (const cauldron of cauldrons) {
                await this.cauldronSyncTaskService.syncTask(cauldron, currentBlock);
            }
        }
    }
}
