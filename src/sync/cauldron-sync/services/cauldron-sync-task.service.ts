import { Injectable } from '@nestjs/common';

import { CauldronEntity } from '../../../common/db/cauldron-entity/dao/cauldron.entity';
import { CauldronEntityService } from '../../../common/db/cauldron-entity/services/cauldron-entity.service';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { LoggerService } from '../../../common/modules/logger/logger.service';
import { getSyncRate } from '../../../utils';

import { CauldronSyncUtilsService } from './cauldron-sync-utils.service';
import { CauldronSyncService } from './cauldron-sync.service';

@Injectable()
export class CauldronSyncTaskService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly cauldronSyncUtilsService: CauldronSyncUtilsService,
        private readonly loggerService: LoggerService,
        private readonly cauldronSyncService: CauldronSyncService,
        private readonly cauldronEntityService: CauldronEntityService,
    ) {}

    public async syncTask(cauldron: CauldronEntity, currentBlock: number): Promise<void> {
        const lastBlock = cauldron.lastSyncBlock || cauldron.creationBlock;
        const { fromBlock, toBlock, canSync } = getSyncRate(lastBlock, currentBlock);
        const isCauldronSyncing = this.cauldronSyncUtilsService.isCauldronSyncing(cauldron);
        if (isCauldronSyncing || !canSync || !cauldron.canSync) return;
        try {
            this.cauldronSyncUtilsService.setCauldronSyncingState(cauldron, true);
            const logs = await this.blockchainService.getContractLogs(cauldron.network, cauldron.address, fromBlock, toBlock);
            await this.cauldronSyncService.parseLogs(cauldron, logs);
            await this.cauldronEntityService.updateOne({ id: cauldron.id }, { lastSyncBlock: toBlock });
            this.cauldronSyncUtilsService.setCauldronSyncingState(cauldron, false);
            this.loggerService.info('Sync logs', { extra: { cauldron: cauldron.address, fromBlock, toBlock } });
        } catch (err) {
            this.cauldronSyncUtilsService.setCauldronSyncingState(cauldron, false);
            this.loggerService.error('Sync logs faild', { extra: { cauldron: cauldron.address, fromBlock, toBlock } });
        }
    }
}
