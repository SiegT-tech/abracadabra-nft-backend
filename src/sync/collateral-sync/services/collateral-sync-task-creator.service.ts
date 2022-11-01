import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CollateralEntityService } from '../../../common/db/collateral-entity/services/collateral-entity.service';
import { availableNetworks } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { cronTimes } from '../../../env';

import { CollateralSyncTaskService } from './collateral-sync-task.service';

@Injectable()
export class CollateralSyncTaskCreatorService {
    constructor(
        private readonly collateralSyncTaskService: CollateralSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly collateralEntityService: CollateralEntityService,
    ) {}

    @Cron(cronTimes.collateral.sync)
    public async createTasks() {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const collaterals = await this.collateralEntityService.read({ network });

            for (const collateral of collaterals) {
                await this.collateralSyncTaskService.syncTask(collateral, currentBlock);
            }
        }
    }

    @Cron(cronTimes.collateral.flowerPrice)
    public async updateFlowerPrice() {
        const collaterals = await this.collateralEntityService.read();
        for (const collateral of collaterals) {
            await this.collateralSyncTaskService.updateFlowerPrice(collateral);
        }
    }
}
