import { Test } from "@nestjs/testing";
import { StaticJsonRpcProvider } from "nestjs-ethers";


import { BentoboxEntity } from "../../../common/db/bentobox-entity/dao/bentobox.entity";
import { BentoboxEntityService } from "../../../common/db/bentobox-entity/services/bentobox-entity.service";
import { availableNetworks, Networks } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from "../../../common/modules/blockchain/services/blockchain.service";

import { BentoboxSyncTaskCreatorService } from "./bentobox-sync-task-creator.service";
import { BentoboxSyncTaskService } from "./bentobox-sync-task.service";

describe("BentoboxSyncTaskCreatorService", () => {
    let bentoboxSyncTaskCreatorService: BentoboxSyncTaskCreatorService;
    let bentoboxSyncTaskService: BentoboxSyncTaskService;
    let blockchainService: BlockchainService;
    let bentoboxEntityService: BentoboxEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BentoboxSyncTaskService, BlockchainService, BentoboxEntityService, BentoboxSyncTaskCreatorService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getProvider: jest.fn,
            })
            .overrideProvider(BentoboxEntityService)
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
        bentoboxEntityService = moduleRef.get(BentoboxEntityService);
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

            readMock = jest.spyOn(bentoboxEntityService, "read").mockResolvedValue([{}] as BentoboxEntity[]);
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