import { Test } from '@nestjs/testing';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { Networks } from '../../blockchain/constants';
import { CollateralEntity } from '../../collateral/dao/collateral.entity';
import { CollateralService } from '../../collateral/services/collateral.service';
import { LoggerService } from '../../logger/logger.service';
import * as utils from '../../utils/get-sync-rate';

import { CollateralSyncTaskService } from './collateral-sync-task.service';
import { CollateralSyncUtilsService } from './collateral-sync-utils.service';
import { CollateralSyncService } from './collateral-sync.service';

describe('CollateralSyncTaskService', () => {
    let collateralSyncTaskService: CollateralSyncTaskService;
    let blockchainService: BlockchainService;
    let collateralSyncUtilsService: CollateralSyncUtilsService;
    let loggerService: LoggerService;
    let collateralSyncService: CollateralSyncService;
    let collateralService: CollateralService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralSyncUtilsService, CollateralSyncTaskService, BlockchainService, LoggerService, CollateralSyncService, CollateralService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getContractLogs: jest.fn,
            })
            .overrideProvider(CollateralSyncUtilsService)
            .useValue({
                isCollateralSyncing: jest.fn,
                setCollateralSyncingState: jest.fn,
            })
            .overrideProvider(LoggerService)
            .useValue({
                info: jest.fn,
            })
            .overrideProvider(CollateralSyncService)
            .useValue({
                parseLogs: jest.fn,
            })
            .overrideProvider(CollateralService)
            .useValue({
                updateOne: jest.fn,
            })
            .compile();

        collateralSyncTaskService = moduleRef.get(CollateralSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        loggerService = moduleRef.get(LoggerService);
        collateralSyncService = moduleRef.get(CollateralSyncService);
        collateralService = moduleRef.get(CollateralService);
        collateralSyncUtilsService = moduleRef.get(CollateralSyncUtilsService);
    });

    describe('syncTask', () => {
        let actual$: Promise<void>;
        let getSyncRateMock: jest.SpyInstance;
        let isCollateralSyncingMock: jest.SpyInstance;
        let setCollateralSyncingStateMock: jest.SpyInstance;
        let getContractLogsMock: jest.SpyInstance;
        let parseLogsMock: jest.SpyInstance;
        let updateOneMock: jest.SpyInstance;
        let infoMock: jest.SpyInstance;

        const collateralMock = { creationBlock: 1, address: 'address', network: Networks.MAINNET, canSync: true } as CollateralEntity;
        const currentBlockMock = 1000;

        beforeEach(() => {
            getSyncRateMock = jest.spyOn(utils, 'getSyncRate').mockReturnValueOnce({ fromBlock: 2, toBlock: currentBlockMock, canSync: true });
            isCollateralSyncingMock = jest.spyOn(collateralSyncUtilsService, 'isCollateralSyncing').mockReturnValueOnce(false);
            setCollateralSyncingStateMock = jest.spyOn(collateralSyncUtilsService, 'setCollateralSyncingState');
            getContractLogsMock = jest.spyOn(blockchainService, 'getContractLogs').mockResolvedValueOnce([]);
            parseLogsMock = jest.spyOn(collateralSyncService, 'parseLogs');
            updateOneMock = jest.spyOn(collateralService, 'updateOne');
            infoMock = jest.spyOn(loggerService, 'info');
            actual$ = collateralSyncTaskService.syncTask(collateralMock, currentBlockMock);
        });

        it('should return void', async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it('should call getSyncRate', async () => {
            await actual$;
            expect(getSyncRateMock).toHaveBeenCalledTimes(1);
            expect(getSyncRateMock).toHaveBeenCalledWith(collateralMock.creationBlock, currentBlockMock);
        });

        it('should call isCauldronSyncing', async () => {
            await actual$;
            expect(isCollateralSyncingMock).toHaveBeenCalledTimes(1);
            expect(isCollateralSyncingMock).toHaveBeenCalledWith(collateralMock);
        });

        it('should call setPairSyncingState', async () => {
            await actual$;
            expect(setCollateralSyncingStateMock).toHaveBeenCalledTimes(2);
            expect(setCollateralSyncingStateMock).toHaveBeenCalledWith(collateralMock, true);
            expect(setCollateralSyncingStateMock).toHaveBeenCalledWith(collateralMock, false);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(getContractLogsMock).toHaveBeenCalledTimes(1);
            expect(getContractLogsMock).toHaveBeenCalledWith(collateralMock.network, collateralMock.address, 2, currentBlockMock);
        });

        it('should call isPairSyncing', async () => {
            await actual$;
            expect(parseLogsMock).toHaveBeenCalledTimes(1);
            expect(parseLogsMock).toHaveBeenCalledWith(collateralMock, []);
        });

        it('should call updateOne', async () => {
            await actual$;
            expect(updateOneMock).toHaveBeenCalledTimes(1);
            expect(updateOneMock).toHaveBeenCalledWith({ id: collateralMock.id }, { lastSyncBlock: currentBlockMock });
        });

        it('should call info', async () => {
            await actual$;
            expect(infoMock).toHaveBeenCalledTimes(1);
            expect(infoMock).toHaveBeenCalledWith('Sync logs', { extra: { collateral: collateralMock.address, fromBlock: 2, toBlock: currentBlockMock } });
        });
    });
});
