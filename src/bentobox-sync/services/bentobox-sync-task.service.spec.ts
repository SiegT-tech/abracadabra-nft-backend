import { Test } from '@nestjs/testing';

import { BentoboxEntity } from '../../bentobox/dao/bentobox.entity';
import { BentoboxService } from '../../bentobox/services/bentobox.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { Networks } from '../../blockchain/constants';
import { LoggerService } from '../../logger/logger.service';
import * as utils from '../../utils/get-sync-rate';

import { BentoboxSyncTaskService } from './bentobox-sync-task.service';
import { BentoboxSyncUtilsService } from './bentobox-sync-utils.service';
import { BentoboxSyncService } from './bentobox-sync.service';

describe('BentoboxSyncTaskService', () => {
    let bentoboxSyncTaskService: BentoboxSyncTaskService;
    let blockchainService: BlockchainService;
    let bentoboxSyncUtilsService: BentoboxSyncUtilsService;
    let loggerService: LoggerService;
    let bentoboxSyncService: BentoboxSyncService;
    let bentoboxService: BentoboxService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BentoboxSyncUtilsService, BentoboxSyncTaskService, BlockchainService, LoggerService, BentoboxSyncService, BentoboxService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getContractLogs: jest.fn,
            })
            .overrideProvider(BentoboxSyncUtilsService)
            .useValue({
                isBentoboxSyncing: jest.fn,
                setBentoboxSyncingState: jest.fn,
            })
            .overrideProvider(LoggerService)
            .useValue({
                info: jest.fn,
            })
            .overrideProvider(BentoboxSyncService)
            .useValue({
                parseLogs: jest.fn,
            })
            .overrideProvider(BentoboxService)
            .useValue({
                updateOne: jest.fn,
            })
            .compile();

        bentoboxSyncTaskService = moduleRef.get(BentoboxSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        loggerService = moduleRef.get(LoggerService);
        bentoboxSyncService = moduleRef.get(BentoboxSyncService);
        bentoboxService = moduleRef.get(BentoboxService);
        bentoboxSyncUtilsService = moduleRef.get(BentoboxSyncUtilsService);
    });

    describe('syncTask', () => {
        let actual$: Promise<void>;
        let getSyncRateMock: jest.SpyInstance;
        let isBentoboxSyncingMock: jest.SpyInstance;
        let setBentoboxSyncingStateMock: jest.SpyInstance;
        let getContractLogsMock: jest.SpyInstance;
        let parseLogsMock: jest.SpyInstance;
        let updateOneMock: jest.SpyInstance;
        let infoMock: jest.SpyInstance;

        const bentoboxMock = { creationBlock: 1, address: 'address', network: Networks.MAINNET, canSync: true } as BentoboxEntity;
        const currentBlockMock = 1000;

        beforeEach(() => {
            getSyncRateMock = jest.spyOn(utils, 'getSyncRate').mockReturnValueOnce({ fromBlock: 2, toBlock: currentBlockMock, canSync: true });
            isBentoboxSyncingMock = jest.spyOn(bentoboxSyncUtilsService, 'isBentoboxSyncing').mockReturnValueOnce(false);
            setBentoboxSyncingStateMock = jest.spyOn(bentoboxSyncUtilsService, 'setBentoboxSyncingState');
            getContractLogsMock = jest.spyOn(blockchainService, 'getContractLogs').mockResolvedValueOnce([]);
            parseLogsMock = jest.spyOn(bentoboxSyncService, 'parseLogs');
            updateOneMock = jest.spyOn(bentoboxService, 'updateOne');
            infoMock = jest.spyOn(loggerService, 'info');
            actual$ = bentoboxSyncTaskService.syncTask(bentoboxMock, currentBlockMock);
        });

        it('should return void', async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it('should call getSyncRate', async () => {
            await actual$;
            expect(getSyncRateMock).toHaveBeenCalledTimes(1);
            expect(getSyncRateMock).toHaveBeenCalledWith(bentoboxMock.creationBlock, currentBlockMock);
        });

        it('should call isBentoboxSyncing', async () => {
            await actual$;
            expect(isBentoboxSyncingMock).toHaveBeenCalledTimes(1);
            expect(isBentoboxSyncingMock).toHaveBeenCalledWith(bentoboxMock);
        });

        it('should call setBentoboxSyncingState', async () => {
            await actual$;
            expect(setBentoboxSyncingStateMock).toHaveBeenCalledTimes(2);
            expect(setBentoboxSyncingStateMock).toHaveBeenCalledWith(bentoboxMock, true);
            expect(setBentoboxSyncingStateMock).toHaveBeenCalledWith(bentoboxMock, false);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(getContractLogsMock).toHaveBeenCalledTimes(1);
            expect(getContractLogsMock).toHaveBeenCalledWith(bentoboxMock.network, bentoboxMock.address, 2, currentBlockMock);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(parseLogsMock).toHaveBeenCalledTimes(1);
            expect(parseLogsMock).toHaveBeenCalledWith(bentoboxMock, []);
        });

        it('should call updateOne', async () => {
            await actual$;
            expect(updateOneMock).toHaveBeenCalledTimes(1);
            expect(updateOneMock).toHaveBeenCalledWith({ id: bentoboxMock.id }, { lastSyncBlock: currentBlockMock });
        });

        it('should call info', async () => {
            await actual$;
            expect(infoMock).toHaveBeenCalledTimes(1);
            expect(infoMock).toHaveBeenCalledWith('Sync logs', { extra: { bentobox: bentoboxMock.address, fromBlock: 2, toBlock: currentBlockMock } });
        });
    });
});
