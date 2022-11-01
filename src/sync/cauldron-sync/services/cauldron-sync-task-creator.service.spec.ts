import { Test } from "@nestjs/testing";
import { StaticJsonRpcProvider } from "nestjs-ethers";

import { CauldronEntity } from "../../../common/db/cauldron-entity/dao/cauldron.entity";
import { CauldronEntityService } from "../../../common/db/cauldron-entity/services/cauldron-entity.service";
import { availableNetworks, Networks } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from "../../../common/modules/blockchain/services/blockchain.service";

import { CauldronSyncTaskCreatorService } from "./cauldron-sync-task-creator.service";
import { CauldronSyncTaskService } from "./cauldron-sync-task.service";

describe("CauldronSyncTaskCreatorService", () => {
    let cauldronSyncTaskCreatorService: CauldronSyncTaskCreatorService;
    let cauldronSyncTaskService: CauldronSyncTaskService;
    let blockchainService: BlockchainService;
    let cauldronEntityService: CauldronEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronSyncTaskService, BlockchainService, CauldronEntityService, CauldronSyncTaskCreatorService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getProvider: jest.fn,
            })
            .overrideProvider(CauldronEntityService)
            .useValue({
                read: jest.fn
            })
            .overrideProvider(CauldronSyncTaskService)
            .useValue({
                syncTask: jest.fn
            })
            .compile();

        cauldronSyncTaskService = moduleRef.get(CauldronSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        cauldronEntityService = moduleRef.get(CauldronEntityService);
        cauldronSyncTaskCreatorService = moduleRef.get(CauldronSyncTaskCreatorService);
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

            readMock = jest.spyOn(cauldronEntityService, "read").mockResolvedValue([{}] as CauldronEntity[]);
            syncTaskMock = jest.spyOn(cauldronSyncTaskService, "syncTask");

            actual$ = cauldronSyncTaskCreatorService.createTasks();
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