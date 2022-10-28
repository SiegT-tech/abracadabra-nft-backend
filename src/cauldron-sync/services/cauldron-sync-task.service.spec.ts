import { Test } from '@nestjs/testing';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { Networks } from '../../blockchain/constants';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { CauldronService } from '../../cauldron/services/cauldron.service';
import { LoggerService } from '../../logger/logger.service';
import * as utils from '../../utils/get-sync-rate';

import { CauldronSyncTaskService } from './cauldron-sync-task.service';
import { CauldronSyncUtilsService } from './cauldron-sync-utils.service';
import { CauldronSyncService } from './cauldron-sync.service';

describe('CauldronSyncTaskService', () => {
    let cauldronSyncTaskService: CauldronSyncTaskService;
    let blockchainService: BlockchainService;
    let cauldronSyncUtilsService: CauldronSyncUtilsService;
    let loggerService: LoggerService;
    let cauldronSyncService: CauldronSyncService;
    let cauldronService: CauldronService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronSyncUtilsService, CauldronSyncTaskService, BlockchainService, LoggerService, CauldronSyncService, CauldronService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getContractLogs: jest.fn,
            })
            .overrideProvider(CauldronSyncUtilsService)
            .useValue({
                isCauldronSyncing: jest.fn,
                setCauldronSyncingState: jest.fn,
            })
            .overrideProvider(LoggerService)
            .useValue({
                info: jest.fn,
            })
            .overrideProvider(CauldronSyncService)
            .useValue({
                parseLogs: jest.fn,
            })
            .overrideProvider(CauldronService)
            .useValue({
                updateOne: jest.fn,
            })
            .compile();

        cauldronSyncTaskService = moduleRef.get(CauldronSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        loggerService = moduleRef.get(LoggerService);
        cauldronSyncService = moduleRef.get(CauldronSyncService);
        cauldronService = moduleRef.get(CauldronService);
        cauldronSyncUtilsService = moduleRef.get(CauldronSyncUtilsService);
    });

    describe('syncTask', () => {
        let actual$: Promise<void>;
        let getSyncRateMock: jest.SpyInstance;
        let isCauldronSyncingMock: jest.SpyInstance;
        let setCauldronSyncingStateMock: jest.SpyInstance;
        let getContractLogsMock: jest.SpyInstance;
        let parseLogsMock: jest.SpyInstance;
        let updateOneMock: jest.SpyInstance;
        let infoMock: jest.SpyInstance;

        const cauldronMock = { creationBlock: 1, address: 'address', network: Networks.MAINNET, canSync: true } as CauldronEntity;
        const currentBlockMock = 1000;

        beforeEach(() => {
            getSyncRateMock = jest.spyOn(utils, 'getSyncRate').mockReturnValueOnce({ fromBlock: 2, toBlock: currentBlockMock, canSync: true });
            isCauldronSyncingMock = jest.spyOn(cauldronSyncUtilsService, 'isCauldronSyncing').mockReturnValueOnce(false);
            setCauldronSyncingStateMock = jest.spyOn(cauldronSyncUtilsService, 'setCauldronSyncingState');
            getContractLogsMock = jest.spyOn(blockchainService, 'getContractLogs').mockResolvedValueOnce([]);
            parseLogsMock = jest.spyOn(cauldronSyncService, 'parseLogs');
            updateOneMock = jest.spyOn(cauldronService, 'updateOne');
            infoMock = jest.spyOn(loggerService, 'info');
            actual$ = cauldronSyncTaskService.syncTask(cauldronMock, currentBlockMock);
        });

        it('should return void', async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it('should call getSyncRate', async () => {
            await actual$;
            expect(getSyncRateMock).toHaveBeenCalledTimes(1);
            expect(getSyncRateMock).toHaveBeenCalledWith(cauldronMock.creationBlock, currentBlockMock);
        });

        it('should call isCauldronSyncing', async () => {
            await actual$;
            expect(isCauldronSyncingMock).toHaveBeenCalledTimes(1);
            expect(isCauldronSyncingMock).toHaveBeenCalledWith(cauldronMock);
        });

        it('should call setPairSyncingState', async () => {
            await actual$;
            expect(setCauldronSyncingStateMock).toHaveBeenCalledTimes(2);
            expect(setCauldronSyncingStateMock).toHaveBeenCalledWith(cauldronMock, true);
            expect(setCauldronSyncingStateMock).toHaveBeenCalledWith(cauldronMock, false);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(getContractLogsMock).toHaveBeenCalledTimes(1);
            expect(getContractLogsMock).toHaveBeenCalledWith(cauldronMock.network, cauldronMock.address, 2, currentBlockMock);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(parseLogsMock).toHaveBeenCalledTimes(1);
            expect(parseLogsMock).toHaveBeenCalledWith(cauldronMock, []);
        });

        it('should call updateOne', async () => {
            await actual$;
            expect(updateOneMock).toHaveBeenCalledTimes(1);
            expect(updateOneMock).toHaveBeenCalledWith({ id: cauldronMock.id }, { lastSyncBlock: currentBlockMock });
        });

        it('should call info', async () => {
            await actual$;
            expect(infoMock).toHaveBeenCalledTimes(1);
            expect(infoMock).toHaveBeenCalledWith('Sync logs', { extra: { cauldron: cauldronMock.address, fromBlock: 2, toBlock: currentBlockMock } });
        });
    });
});
