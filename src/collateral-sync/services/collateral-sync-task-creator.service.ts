import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { availableNetworks } from '../../blockchain/constants';
import { CollateralService } from '../../collateral/services/collateral.service';
import { cronTimes } from '../../env';

import { CollateralSyncTaskService } from './collateral-sync-task.service';

@Injectable()
export class CollateralSyncTaskCreatorService {
    constructor(
        private readonly collateralSyncTaskService: CollateralSyncTaskService,
        private readonly blockchainService: BlockchainService,
        private readonly collateralService: CollateralService,
    ) {}

    @Cron(cronTimes.collateral.sync)
    public async createTasks() {
        for (const network of availableNetworks) {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const collaterals = await this.collateralService.read({ network });

            for (const collateral of collaterals) {
                await this.collateralSyncTaskService.syncTask(collateral, currentBlock);
            }
        }
    }

    @Cron(cronTimes.collateral.flowerPrice)
    public async updateFlowerPrice() {
        const collaterals = await this.collateralService.read();
        for (const collateral of collaterals) {
            await this.collateralSyncTaskService.updateFlowerPrice(collateral);
        }
    }
}
