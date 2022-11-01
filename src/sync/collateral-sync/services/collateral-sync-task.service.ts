import { Injectable } from '@nestjs/common';

import { CollateralEntity } from '../../../common/db/collateral-entity/dao/collateral.entity';
import { CollateralEntityService } from '../../../common/db/collateral-entity/services/collateral-entity.service';
import { BlockchainHelpersService } from '../../../common/modules/blockchain/services/blockchain-helpers.service';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { LoggerService } from '../../../common/modules/logger/logger.service';
import { getSyncRate } from '../../../utils';

import { CollateralSyncUtilsService } from './collateral-sync-utils.service';
import { CollateralSyncService } from './collateral-sync.service';

@Injectable()
export class CollateralSyncTaskService {
    constructor(
        private readonly collateralSyncUtilsService: CollateralSyncUtilsService,
        private readonly loggerService: LoggerService,
        private readonly blockchainService: BlockchainService,
        private readonly collateralSyncService: CollateralSyncService,
        private readonly collateralEntityService: CollateralEntityService,
        private readonly blockchainHelpersService: BlockchainHelpersService,
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
            await this.collateralEntityService.updateOne({ id: collateral.id }, { lastSyncBlock: toBlock });
            this.collateralSyncUtilsService.setCollateralSyncingState(collateral, false);
            this.loggerService.info('Sync logs', { extra: { collateral: collateral.address, fromBlock, toBlock } });
        } catch (err) {
            this.collateralSyncUtilsService.setCollateralSyncingState(collateral, false);
            this.loggerService.error('Sync logs faild', { extra: { collateral: collateral.address, fromBlock, toBlock } });
        }
    }

    public async updateFlowerPrice(collateral: CollateralEntity) {
        const { floorPrice } = await this.blockchainHelpersService.getCollateralInfo(collateral);
        if (floorPrice) {
            await this.collateralEntityService.updateOne({ id: collateral.id }, { floorPrice });
        }
    }
}
