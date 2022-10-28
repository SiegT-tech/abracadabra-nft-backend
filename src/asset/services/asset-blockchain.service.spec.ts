import { Test } from "@nestjs/testing";

import { BlockchainService } from "../../blockchain/blockchain.service";
import { Networks } from "../../blockchain/constants";
import { LoggerService  } from "../../logger/logger.service";
import { Token } from "../../typechain";

import { AssetBlockchainService } from "./asset-blockchain.service";

import { IAsset } from "../interfaces/asset.interface";

describe("AssetBlockchainService", () => {
    let assetBlockchainService: AssetBlockchainService;
    let loggerService: LoggerService;
    let blockchainService: BlockchainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetBlockchainService, BlockchainService, LoggerService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getToken: jest.fn,
            })
            .overrideProvider(LoggerService)
            .useValue({
                error: jest.fn
            })
            .compile();

        blockchainService = moduleRef.get(BlockchainService);
        assetBlockchainService = moduleRef.get(AssetBlockchainService);
        loggerService = moduleRef.get(LoggerService);
    });

    describe("getAsset", () => {
        let getTokenMock: jest.SpyInstance<Token, [network: Networks, address: string]>;
        let nameMock: jest.SpyInstance;
        let decimalsMock: jest.SpyInstance;
        let actual$: Promise<IAsset>
        let errorMock: jest.SpyInstance;

        beforeEach(() => {
            getTokenMock = jest.spyOn(blockchainService, "getToken").mockReturnValue({ name: jest.fn, decimals: jest.fn } as unknown as Token);
            const getTokenMockImplementation = getTokenMock.getMockImplementation();
            const token = getTokenMockImplementation(Networks.MAINNET, "address");
            nameMock = jest.spyOn(token, "name").mockResolvedValueOnce("name");
            decimalsMock = jest.spyOn(token, "decimals").mockResolvedValueOnce(18);
            errorMock = jest.spyOn(loggerService, "error");
            actual$ = assetBlockchainService.getAsset(Networks.MAINNET, "address");
        });

        it("should return asset", async () => {
            const actual = await actual$;
            expect(actual).toEqual({ network: Networks.MAINNET, address: "address", name: "name", decimals: 18 });
        });

        it("should call getToken", async () => {
            await actual$;
            expect(getTokenMock).toHaveBeenCalledTimes(1);
            expect(getTokenMock).toHaveBeenCalledWith(Networks.MAINNET, "address");
        });

        it("should call name", async () => {
            await actual$;
            expect(nameMock).toHaveBeenCalledTimes(1);
        });

        it("should call decimals", async () => {
            await actual$;
            expect(decimalsMock).toHaveBeenCalledTimes(1);
        });

        it("should call error", async () => {
            await actual$;
            expect(errorMock).toHaveBeenCalledTimes(0);
        });
    });
});