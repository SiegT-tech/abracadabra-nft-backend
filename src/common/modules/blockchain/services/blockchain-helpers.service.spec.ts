import { Test } from "@nestjs/testing";
import { BigNumber } from "nestjs-ethers";

import { Collateral, Token } from "../../../../typechain";
import { CollateralEntity } from "../../../db/collateral-entity/dao/collateral.entity";
import { NftEntity } from "../../../db/nft-entity/dao/nft.entity";
import { NftAttributesEntityHelpersService } from "../../../db/nft-entity/services/nft-attributes-entity-helpers.service";
import { LoggerService  } from "../../logger/logger.service";

import { BlockchainExplorerApiService } from "./blockchain-explorer-api.service";
import { BlockchainExternalApisService } from "./blockchain-external-apis.service";
import { BlockchainHelpersService } from "./blockchain-helpers.service";
import { BlockchainService } from "./blockchain.service";

import { Networks } from "../constants";
import { IAsset } from "../interfaces/asset.interface";
import { NftInfo } from "../interfaces/nft.interface";



describe("BlockchainHelpersService", () => {
    let blockchainHelpersService: BlockchainHelpersService;
    let blockchainService: BlockchainService;
    let blockchainExplorerApiService: BlockchainExplorerApiService;
    let blockchainExternalApisService: BlockchainExternalApisService;
    let nftAttributesEntityHelpersService: NftAttributesEntityHelpersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BlockchainHelpersService, BlockchainService, BlockchainExplorerApiService, BlockchainExternalApisService, NftAttributesEntityHelpersService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getToken: jest.fn,
                getCollateral: jest.fn,
            })
            .overrideProvider(LoggerService)
            .useValue({
                error: jest.fn
            })
            .overrideProvider(BlockchainExplorerApiService)
            .useValue({
                getContractCreationBlockNumber: jest.fn
            })
            .overrideProvider(BlockchainExternalApisService)
            .useValue({
                getNftInfo: jest.fn,
                opensea: jest.fn,
                coingecko: jest.fn,
                rarible: jest.fn,
            })
            .overrideProvider(NftAttributesEntityHelpersService)
            .useValue({
                findOrCreateNftAttributes: jest.fn
            })
            .compile();

        blockchainService = moduleRef.get(BlockchainService);
        blockchainHelpersService = moduleRef.get(BlockchainHelpersService);
        blockchainExplorerApiService = moduleRef.get(BlockchainExplorerApiService);
        blockchainExternalApisService = moduleRef.get(BlockchainExternalApisService);
        nftAttributesEntityHelpersService = moduleRef.get(NftAttributesEntityHelpersService);
    });

    describe("getNft", () => {
        let getCollateralMock: jest.SpyInstance<Collateral, [network: Networks, address: string]>;
        let tokenURIMock: jest.SpyInstance;
        let ownerOfMock: jest.SpyInstance;
        let getNftInfoMock: jest.SpyInstance;
        let findOrCreateNftAttributesMock: jest.SpyInstance;
        let actual$: Promise<Partial<NftEntity>>

        beforeEach(() => {
            getCollateralMock = jest.spyOn(blockchainService, "getCollateral").mockReturnValue({ tokenURI: jest.fn, ownerOf: jest.fn } as unknown as Collateral);
            const getCollateralMockImplementation = getCollateralMock.getMockImplementation();
            const collateral = getCollateralMockImplementation(Networks.MAINNET, "address");
            tokenURIMock = jest.spyOn(collateral, "tokenURI").mockResolvedValueOnce("tokenURI");
            ownerOfMock = jest.spyOn(collateral, "ownerOf").mockResolvedValueOnce("address");
            getNftInfoMock = jest.spyOn(blockchainExternalApisService, "getNftInfo").mockResolvedValueOnce({ name: "name", description: "description", image: "image", attributes: [{ value: "", trait_type: ""}]} as NftInfo);
            findOrCreateNftAttributesMock = jest.spyOn(nftAttributesEntityHelpersService, "findOrCreateNftAttributes").mockResolvedValueOnce([]);
            actual$ = blockchainHelpersService.getNft({ network: Networks.MAINNET, address : "address"} as CollateralEntity, 1);
        });

        it("should return nft", async () => {
            const actual = await actual$;
            expect(actual).toEqual({
                collateral: { network: Networks.MAINNET, address : "address"},
                tokenId: 1,
                owner: "address",
                tokenUrl: "tokenURI",
                name: "name",
                description: "description",
                image: "image",
                attributes: [],
            });
        });

        it("should call getCollateral", async () => {
            await actual$;
            expect(getCollateralMock).toHaveBeenCalledTimes(1);
            expect(getCollateralMock).toHaveBeenCalledWith(Networks.MAINNET, "address");
        });

        it("should call tokenURI", async () => {
            await actual$;
            expect(tokenURIMock).toHaveBeenCalledTimes(1);
            expect(tokenURIMock).toHaveBeenCalledWith(1);
        });

        it("should call ownerOf", async () => {
            await actual$;
            expect(ownerOfMock).toHaveBeenCalledTimes(1);
            expect(ownerOfMock).toHaveBeenCalledWith(1);
        });

        it("should call getNftInfo", async () => {
            await actual$;
            expect(getNftInfoMock).toHaveBeenCalledTimes(1);
            expect(getNftInfoMock).toHaveBeenCalledWith("tokenURI");
        });

        it("should call findOrCreateNftAttributes", async () => {
            await actual$;
            expect(findOrCreateNftAttributesMock).toHaveBeenCalledTimes(1);
            expect(findOrCreateNftAttributesMock).toHaveBeenCalledWith({"address": "address", "network": 1}, [{ value: "", trait_type: ""}]);
        });
    })

    describe("getAsset", () => {
        let getTokenMock: jest.SpyInstance<Token, [network: Networks, address: string]>;
        let nameMock: jest.SpyInstance;
        let decimalsMock: jest.SpyInstance;
        let actual$: Promise<IAsset>

        beforeEach(() => {
            getTokenMock = jest.spyOn(blockchainService, "getToken").mockReturnValue({ name: jest.fn, decimals: jest.fn } as unknown as Token);
            const getTokenMockImplementation = getTokenMock.getMockImplementation();
            const token = getTokenMockImplementation(Networks.MAINNET, "address");
            nameMock = jest.spyOn(token, "name").mockResolvedValueOnce("name");
            decimalsMock = jest.spyOn(token, "decimals").mockResolvedValueOnce(18);
            actual$ = blockchainHelpersService.getAsset(Networks.MAINNET, "address");
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
    });

    describe("getCollateralInfo", () => {
        let openseaMock: jest.SpyInstance;
        let coingeckoMock: jest.SpyInstance;
        let raribleMock: jest.SpyInstance;
        let actual$: Promise<Partial<CollateralEntity>>;

        beforeEach(() => {
            openseaMock = jest.spyOn(blockchainExternalApisService, "opensea").mockResolvedValueOnce({});
            coingeckoMock = jest.spyOn(blockchainExternalApisService, "coingecko").mockResolvedValueOnce({});
            raribleMock = jest.spyOn(blockchainExternalApisService, "rarible").mockResolvedValueOnce({});
            actual$ = blockchainHelpersService.getCollateralInfo({});
        });

        it("should return collateral", async () => {
            const actual = await actual$;
            expect(actual).toEqual({});
        });

        it("should call opensea", async () => {
            await actual$;

            expect(openseaMock).toHaveBeenCalledTimes(1);
            expect(openseaMock).toHaveBeenCalledWith({});
        });

        it("should call coingecko", async () => {
            await actual$;

            expect(coingeckoMock).toHaveBeenCalledTimes(1);
            expect(coingeckoMock).toHaveBeenCalledWith({});
        });

        it("should call rarible", async () => {
            await actual$;

            expect(raribleMock).toHaveBeenCalledTimes(1);
            expect(raribleMock).toHaveBeenCalledWith({});
        });
    });

    describe("getCollateral", () => {
        let getCollateralMock: jest.SpyInstance<Collateral, [network: Networks, address: string]>;
        let nameMock: jest.SpyInstance;
        let totalSupplyMock: jest.SpyInstance;
        let getContractCreationBlockNumberMock: jest.SpyInstance;
        let getCollateralInfoMock: jest.SpyInstance;
        let ownerOfMock: jest.SpyInstance;
        let actual$: Promise<Partial<CollateralEntity>>;

        beforeEach(() => {
            getCollateralMock = jest.spyOn(blockchainService, "getCollateral").mockReturnValue({ name: jest.fn, totalSupply: jest.fn, ownerOf: jest.fn } as unknown as Collateral);
            const getCollateralMockImplementation = getCollateralMock.getMockImplementation();
            const collateral = getCollateralMockImplementation(Networks.MAINNET, "address");
            nameMock = jest.spyOn(collateral, "name").mockResolvedValueOnce("name");
            totalSupplyMock = jest.spyOn(collateral, "totalSupply").mockResolvedValueOnce(BigNumber.from(10));
            getContractCreationBlockNumberMock = jest.spyOn(blockchainExplorerApiService, "getContractCreationBlockNumber").mockResolvedValueOnce(1000);
            getCollateralInfoMock = jest.spyOn(blockchainHelpersService, "getCollateralInfo").mockResolvedValueOnce({ network: 1, address: "address", name: "name", totalSupply: 10, creationBlock: 1000 });
            ownerOfMock = jest.spyOn(collateral, "ownerOf").mockResolvedValueOnce("address");
            actual$ = blockchainHelpersService.getCollateral(Networks.MAINNET, "address");
        });

        it("should resutn collateral", async () => {
            const actual = await actual$;
            expect(actual).toEqual({ network: 1, address: "address", name: "name", totalSupply: 10, creationBlock: 1000, "idsStartFrom": 0});
        });

        it("should call getCollateral", async() => {
            await actual$;
            expect(getCollateralMock).toHaveBeenCalledTimes(1);
            expect(getCollateralMock).toHaveBeenCalledWith(Networks.MAINNET, "address");
        })

        it("should call name", async() => {
            await actual$;
            expect(nameMock).toHaveBeenCalledTimes(1);
        })

        it("should call totalSupply", async() => {
            await actual$;
            expect(totalSupplyMock).toHaveBeenCalledTimes(1);
        })

        it("should call getContractCreationBlockNumber", async() => {
            await actual$;
            expect(getContractCreationBlockNumberMock).toHaveBeenCalledTimes(1);
            expect(getContractCreationBlockNumberMock).toHaveBeenCalledWith(Networks.MAINNET, "address");
        })

        it("should call getCollateralInfo", async() => {
            await actual$;
            expect(getCollateralInfoMock).toHaveBeenCalledTimes(1);
            expect(getCollateralInfoMock).toHaveBeenCalledWith({ network: 1, address: "address", name: "name", totalSupply: 10, creationBlock: 1000, "idsStartFrom": 0, });
        })

        it("should call ownerOf", async() => {
            await actual$;
            expect(ownerOfMock).toHaveBeenCalledTimes(1);
            expect(ownerOfMock).toHaveBeenCalledWith(0);
        })
    });
});