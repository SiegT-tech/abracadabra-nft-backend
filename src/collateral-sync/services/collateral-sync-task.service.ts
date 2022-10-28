import { Injectable } from '@nestjs/common';
import { CollateralApiService } from '../../collateral/services/collateral-api.service';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CollateralEntity } from '../../collateral/dao/collateral.entity';
import { CollateralService } from '../../collateral/services/collateral.service';
import { LoggerService } from '../../logger/logger.service';
import { getSyncRate } from '../../utils';

import { CollateralSyncUtilsService } from './collateral-sync-utils.service';
import { CollateralSyncService } from './collateral-sync.service';

@Injectable()
export class CollateralSyncTaskService {
    constructor(
        private readonly collateralSyncUtilsService: CollateralSyncUtilsService,
        private readonly loggerService: LoggerService,
        private readonly blockchainService: BlockchainService,
        private readonly collateralSyncService: CollateralSyncService,
        private readonly collateralService: CollateralService,
        private readonly collateralApiService: CollateralApiService
    ) {}

    public async syncTask(collateral: CollateralEntity, currentBlock: number): Promise<void> {
        const lastBlock = collateral.lastSyncBlock || collateral.creationBlock;
        const { fromBlock, toBlock, canSync } = getSyncRate(lastBlock, currentBlock);
        const isCauldronSyncing = this.collateralSyncUtilsService.isCollateralSyncing(collateral);
        if (isCauldronSyncing || !canSync || !collateral.canSync) return;
        try {
            this.collateralSyncUtilsService.setCollateralSyncingState(collateral, true);
            const logs = await this.blockchainService.getContractLogs(collateral.network, collateral.address, fromBlock, toBlock);
            await this.collateralSyncService.parseLogs(collateral, logs);
            await this.collateralService.updateOne({ id: collateral.id }, { lastSyncBlock: toBlock });
            this.collateralSyncUtilsService.setCollateralSyncingState(collateral, false);
            this.loggerService.info('Sync logs', { extra: { collateral: collateral.address, fromBlock, toBlock } });
        } catch (err) {
            this.collateralSyncUtilsService.setCollateralSyncingState(collateral, false);
            this.loggerService.error('Sync logs faild', { extra: { collateral: collateral.address, fromBlock, toBlock } });
        }
    }

    public async updateFlowerPrice({ id, name, address, network }: CollateralEntity){
        const { floorPrice } = await this.collateralApiService.getCollateralInfo(name, address, network);
        if(floorPrice){
            await this.collateralService.updateOne({ id }, { floorPrice });
        }
    }
}
