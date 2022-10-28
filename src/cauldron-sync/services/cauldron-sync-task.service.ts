import { Injectable } from '@nestjs/common';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { CauldronService } from '../../cauldron/services/cauldron.service';
import { LoggerService } from '../../logger/logger.service';
import { getSyncRate } from '../../utils';

import { CauldronSyncUtilsService } from './cauldron-sync-utils.service';
import { CauldronSyncService } from './cauldron-sync.service';

@Injectable()
export class CauldronSyncTaskService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly cauldronSyncUtilsService: CauldronSyncUtilsService,
        private readonly loggerService: LoggerService,
        private readonly cauldronSyncService: CauldronSyncService,
        private readonly cauldronService: CauldronService,
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
            await this.cauldronService.updateOne({ id: cauldron.id }, { lastSyncBlock: toBlock });
            this.cauldronSyncUtilsService.setCauldronSyncingState(cauldron, false);
            this.loggerService.info('Sync logs', { extra: { cauldron: cauldron.address, fromBlock, toBlock } });
        } catch (err) {
            this.cauldronSyncUtilsService.setCauldronSyncingState(cauldron, false);
            this.loggerService.error('Sync logs faild', { extra: { cauldron: cauldron.address, fromBlock, toBlock } });
        }
    }
}
