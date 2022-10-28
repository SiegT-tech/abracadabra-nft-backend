import { Test } from "@nestjs/testing";
import { StaticJsonRpcProvider } from "nestjs-ethers";

import { BentoboxEntity } from "../../bentobox/dao/bentobox.entity";
import { BentoboxService } from "../../bentobox/services/bentobox.service";
import { BlockchainService } from "../../blockchain/blockchain.service";
import { availableNetworks, Networks } from "../../blockchain/constants";

import { BentoboxSyncTaskCreatorService } from "./bentobox-sync-task-creator.service";
import { BentoboxSyncTaskService } from "./bentobox-sync-task.service";

describe("BentoboxSyncTaskCreatorService", () => {
    let bentoboxSyncTaskCreatorService: BentoboxSyncTaskCreatorService;
    let bentoboxSyncTaskService: BentoboxSyncTaskService;
    let blockchainService: BlockchainService;
    let bentoboxService: BentoboxService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BentoboxSyncTaskService, BlockchainService, BentoboxService, BentoboxSyncTaskCreatorService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getProvider: jest.fn,
            })
            .overrideProvider(BentoboxService)
            .useValue({
                read: jest.fn
            })
            .overrideProvider(BentoboxSyncTaskService)
            .useValue({
                syncTask: jest.fn
            })
            .compile();

        bentoboxSyncTaskService = moduleRef.get(BentoboxSyncTaskService);
        blockchainService = moduleRef.get(BlockchainService);
        bentoboxService = moduleRef.get(BentoboxService);
        bentoboxSyncTaskCreatorService = moduleRef.get(BentoboxSyncTaskCreatorService);
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

            readMock = jest.spyOn(bentoboxService, "read").mockResolvedValue([{}] as BentoboxEntity[]);
            syncTaskMock = jest.spyOn(bentoboxSyncTaskService, "syncTask");

            actual$ = bentoboxSyncTaskCreatorService.createTasks();
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