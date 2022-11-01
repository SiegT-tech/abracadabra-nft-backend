import { Test } from "@nestjs/testing";
import { StaticJsonRpcProvider } from "nestjs-ethers";

import { CollateralEntity } from "../../../common/db/collateral-entity/dao/collateral.entity";
import { CollateralEntityService } from '../../../common/db/collateral-entity/services/collateral-entity.service';
import { availableNetworks, Networks } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';

import { CollateralSyncTaskCreatorService } from "./collateral-sync-task-creator.service";
import { CollateralSyncTaskService } from './collateral-sync-task.service';

describe("CollateralSyncTaskCreatorService", () => {
    let collateralSyncTaskCreatorService: CollateralSyncTaskCreatorService;
    let collateralSyncTaskService: CollateralSyncTaskService;
    let blockchainService: BlockchainService;
    let collateralEntityService: CollateralEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralSyncTaskCreatorService, CollateralSyncTaskService, BlockchainService, CollateralEntityService],
        })
            .overrideProvider(CollateralSyncTaskService)
            .useValue({
                syncTask: jest.fn,
            })
            .overrideProvider(BlockchainService)
            .useValue({
                getProvider: jest.fn
            })
            .overrideProvider(CollateralEntityService)
            .useValue({
                read: jest.fn
            })
            .compile();
        
        collateralSyncTaskCreatorService = moduleRef.get(CollateralSyncTaskCreatorService);
        collateralSyncTaskService = moduleRef.get(CollateralSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        collateralEntityService = moduleRef.get(CollateralEntityService);
    });

    describe("createTasks", () => {
        let actual$: Promise<void>;
        let getProviderMock: jest.SpyInstance<StaticJsonRpcProvider, [network: Networks]>
        let getBlockNumberMock: jest.SpyInstance;
        let readMock: jest.SpyInstance;
        let syncTaskMock: jest.SpyInstance;

        beforeEach(() => {
            getProviderMock = jest.spyOn(blockchainService, "getProvider").mockReturnValue({ getBlockNumber: jest.fn() } as unknown as StaticJsonRpcProvider);
            
            const getProviderMockImplementation = getProviderMock.getMockImplementation();
            const provider = getProviderMockImplementation(Networks.MAINNET);
            getBlockNumberMock = jest.spyOn(provider, "getBlockNumber").mockResolvedValue(1);

            readMock = jest.spyOn(collateralEntityService, "read").mockResolvedValue([{}] as CollateralEntity[]);
            syncTaskMock = jest.spyOn(collateralSyncTaskService, "syncTask");

            actual$ = collateralSyncTaskCreatorService.createTasks();
        });

        it("should return void", async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it("should call provider", async () => {
            await actual$;
            expect(getProviderMock).toHaveBeenCalledTimes(availableNetworks.length);
            for(const network of availableNetworks){
                expect(getProviderMock).toHaveBeenCalledWith(network);
            }            
        });

        it("should call getBlockNumber", async () => {
            await actual$;
            expect(getBlockNumberMock).toHaveBeenCalledTimes(availableNetworks.length);         
        });

        it("should call read", async () => {
            await actual$;
            expect(readMock).toHaveBeenCalledTimes(availableNetworks.length);
            for(const network of availableNetworks){
                expect(readMock).toHaveBeenCalledWith({ network });
            }            
        });

        it("should call syncTask", async () => {
            await actual$;
            expect(syncTaskMock).toHaveBeenCalledTimes(availableNetworks.length);
            for(let i = 0; i < availableNetworks.length; i++ ){
                expect(syncTaskMock).toHaveBeenCalledWith({ }, 1);
            }            
        });
    });
});