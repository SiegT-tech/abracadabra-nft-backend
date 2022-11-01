import { Injectable } from '@nestjs/common';

import { BentoboxEntity } from '../../../common/db/bentobox-entity/dao/bentobox.entity';
import { BentoboxEntityService } from '../../../common/db/bentobox-entity/services/bentobox-entity.service';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { LoggerService } from '../../../common/modules/logger/logger.service';
import { getSyncRate } from '../../../utils';

import { BentoboxSyncUtilsService } from './bentobox-sync-utils.service';
import { BentoboxSyncService } from './bentobox-sync.service';

@Injectable()
export class BentoboxSyncTaskService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly bentoboxSyncService: BentoboxSyncService,
        private readonly bentoboxSyncUtilsService: BentoboxSyncUtilsService,
        private readonly loggerService: LoggerService,
        private readonly bentoboxEntityService: BentoboxEntityService,
    ) {}

    public async syncTask(bentobox: BentoboxEntity, currentBlock: number): Promise<void> {
        const lastBlock = bentobox.lastSyncBlock || bentobox.creationBlock;
        const { fromBlock, toBlock, canSync } = getSyncRate(lastBlock, currentBlock);
        const isPairSyncing = this.bentoboxSyncUtilsService.isBentoboxSyncing(bentobox);
        if (isPairSyncing || !canSync || !bentobox.canSync) return;
        try {
            this.bentoboxSyncUtilsService.setBentoboxSyncingState(bentobox, true);
            const logs = await this.blockchainService.getContractLogs(bentobox.network, bentobox.address, fromBlock, toBlock);
            await this.bentoboxSyncService.parseLogs(bentobox, logs);
            await this.bentoboxEntityService.updateOne({ id: bentobox.id }, { lastSyncBlock: toBlock });
            this.bentoboxSyncUtilsService.setBentoboxSyncingState(bentobox, false);
            this.loggerService.info('Sync logs', { extra: { bentobox: bentobox.address, fromBlock, toBlock } });
        } catch (err) {
            this.bentoboxSyncUtilsService.setBentoboxSyncingState(bentobox, false);
            this.loggerService.error('Sync logs faild', { extra: { bentobox: bentobox.address, fromBlock, toBlock } });
        }
    }
}
