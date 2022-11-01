import { BlockchainExplorerApiService } from "./blockchain-explorer-api.service";
import { HttpService } from '@nestjs/axios';
import { BlockchainService } from './blockchain.service';
import { Test } from "@nestjs/testing";
import { Networks } from "../constants";
import { of } from "rxjs";
import { StaticJsonRpcProvider, TransactionResponse } from "nestjs-ethers";

describe("BlockchainExplorerApiService", () => {
    let blockchainExplorerApiService: BlockchainExplorerApiService;
    let httpService: HttpService;
    let blockchainService: BlockchainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [HttpService, BlockchainService, BlockchainExplorerApiService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getProvider: jest.fn,
            })
            .overrideProvider(HttpService)
            .useValue({
                get: jest.fn
            })
            .compile();

        blockchainService = moduleRef.get(BlockchainService);
        blockchainExplorerApiService = moduleRef.get(BlockchainExplorerApiService);
        httpService = moduleRef.get(HttpService);
    });

    describe("getContractsCreationTxHash", () => {
        let getMock: jest.SpyInstance;
        let actual$: Promise<string[]>;

        beforeEach(() => {
            getMock = jest.spyOn(httpService, "get").mockReturnValueOnce(of({ data: {result : [{txHash: "txHash"}]}} as any));
            actual$ = blockchainExplorerApiService.getContractsCreationTxHash(Networks.MAINNET, ["address"]);
        });

        it("should return txhash array", async () => {
            const actual = await actual$;
            expect(actual).toEqual(["txHash"])
        });

        it("should call get", async () => {
            await actual$;
            expect(getMock).toBeCalledTimes(1);
            expect(getMock).toBeCalledWith("https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=address");
        })
    })

    describe("getContractsCreationBlockNumber", () => {
        let getTransactionMock: jest.SpyInstance;
        let getContractsCreationTxHashMock: jest.SpyInstance;
        let getProviderMock: jest.SpyInstance<StaticJsonRpcProvider, [network: Networks]>;
        let actual$: Promise<number[]>;
        
        beforeEach(() => {
            getProviderMock = jest.spyOn(blockchainService, "getProvider").mockReturnValue({ getTransaction: jest.fn } as unknown as StaticJsonRpcProvider);
            
            const getProviderMockImplementation = getProviderMock.getMockImplementation();
            const provider = getProviderMockImplementation(Networks.MAINNET);
            getTransactionMock = jest.spyOn(provider, "getTransaction").mockResolvedValue({ blockNumber: 1 } as TransactionResponse);
            getContractsCreationTxHashMock = jest.spyOn(blockchainExplorerApiService, "getContractsCreationTxHash").mockResolvedValueOnce(["txHash"]);
            actual$ = blockchainExplorerApiService.getContractsCreationBlockNumber(Networks.MAINNET, ["address"]);
        });

        it("should return blockNumber array", async () => {
            const actual = await actual$;
            expect(actual).toEqual([1]);
        });

        it("should call getProvider", async () => {
            await actual$;
            expect(getProviderMock).toHaveBeenCalledTimes(1);
            expect(getProviderMock).toHaveBeenCalledWith(Networks.MAINNET);
        });

        it("should call getProvider", async () => {
            await actual$;
            expect(getContractsCreationTxHashMock).toHaveBeenCalledTimes(1);
            expect(getContractsCreationTxHashMock).toHaveBeenCalledWith(Networks.MAINNET, ["address"]);
        });

        it("should call getTransaction", async () => {
            await actual$;
            expect(getTransactionMock).toHaveBeenCalledTimes(1);
            expect(getTransactionMock).toHaveBeenCalledWith("txHash");
        });
    })

    describe("getContractCreationBlockNumber", () => {
        let getContractsCreationBlockNumberMock: jest.SpyInstance;
        let acrual$: Promise<number>;

        beforeEach(() => {
            getContractsCreationBlockNumberMock = jest.spyOn(blockchainExplorerApiService, "getContractsCreationBlockNumber").mockResolvedValueOnce([100]);
            acrual$ = blockchainExplorerApiService.getContractCreationBlockNumber(Networks.MAINNET, "address");
        });

        it("should return number", async () => {
            const actual = await acrual$;
            expect(actual).toEqual(100);
        });

        it("should call getContractsCreationBlockNumber", async () => {
            await acrual$;
            expect(getContractsCreationBlockNumberMock).toBeCalledTimes(1);
            expect(getContractsCreationBlockNumberMock).toBeCalledWith(Networks.MAINNET, ["address"]);
        })
    })
});