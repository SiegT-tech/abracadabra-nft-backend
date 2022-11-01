import { Test } from "@nestjs/testing";
import { Log } from "nestjs-ethers";

import { AssetEntity } from "../../../common/db/asset-entity/dao/asset.entity";
import { AssetEntityHelpersService } from "../../../common/db/asset-entity/services/asset-entity-helpers.service";
import { BentoboxEntity } from "../../../common/db/bentobox-entity/dao/bentobox.entity";
import { CauldronEntityService } from "../../../common/db/cauldron-entity/services/cauldron-entity.service";
import { CollateralEntity } from "../../../common/db/collateral-entity/dao/collateral.entity";
import { CollateralEntityHelpersService } from "../../../common/db/collateral-entity/services/collateral-entity-helpers.service";
import { BentoboxEvents, Networks , masterContracts } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from "../../../common/modules/blockchain/services/blockchain.service";
import { BentoBox, NFTPair } from "../../../typechain";
import * as utils from "../../../utils/is-address-in-array";

import { BentoboxSyncService } from "./bentobox-sync.service";


describe("BentoboxSyncService", () => {
    let blockchainService: BlockchainService;
    let cauldronEntityService: CauldronEntityService;
    let bentoboxSyncService: BentoboxSyncService;
    let assetEntityHelpersService: AssetEntityHelpersService;
    let collateralEntityHelpersService: CollateralEntityHelpersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BlockchainService, CauldronEntityService, BentoboxSyncService, AssetEntityHelpersService, CollateralEntityHelpersService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getBentobox: jest.fn,
                getNftPair: jest.fn,
            })
            .overrideProvider(CauldronEntityService)
            .useValue({
                create: jest.fn
            })
            .overrideProvider(AssetEntityHelpersService)
            .useValue({
                findOrCreateAsset: jest.fn
            })
            .overrideProvider(CollateralEntityHelpersService)
            .useValue({
                findOrCreateCollateral: jest.fn
            })
            .compile();

        blockchainService = moduleRef.get(BlockchainService);
        cauldronEntityService = moduleRef.get(CauldronEntityService);
        bentoboxSyncService = moduleRef.get(BentoboxSyncService);
        assetEntityHelpersService = moduleRef.get(AssetEntityHelpersService);
        collateralEntityHelpersService = moduleRef.get(CollateralEntityHelpersService);
    });

    describe("parseLogs", () => {
        let actual$: Promise<void>;
        let getBentoboxMock: jest.SpyInstance<BentoBox, [network: Networks, address: string]>;
        let parseLogMock: jest.SpyInstance;
        let isAddressInArrayMock: jest.SpyInstance;
        let createMock: jest.SpyInstance;
        let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
        let findOrCreateAssetMock: jest.SpyInstance;
        let findOrCreateCollateralMock: jest.SpyInstance;
        let assetMock: jest.SpyInstance;
        let collateralMock: jest.SpyInstance;

        const bentoboxMock = { address: "0x9A5620779feF1928eF87c1111491212efC2C3cB8", network: Networks.MAINNET } as BentoboxEntity;

        beforeEach(() => {
            getBentoboxMock = jest.spyOn(blockchainService, "getBentobox").mockReturnValue({interface: {
                parseLog: jest.fn
            }} as unknown as BentoBox);
            const getBentoboxMockImplementation = getBentoboxMock.getMockImplementation();
            const bentobox = getBentoboxMockImplementation(Networks.MAINNET, bentoboxMock.address);
            parseLogMock = jest.spyOn(bentobox.interface, "parseLog").mockReturnValueOnce({
                name: BentoboxEvents.LogDeploy,
                args: {
                    masterContract: "masterContract",
                    cloneAddress: "cloneAddress"
                }
            } as any);

            isAddressInArrayMock = jest.spyOn(utils, "isAddressInArray").mockReturnValueOnce(true);

            getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({ asset: jest.fn, collateral: jest.fn } as unknown as NFTPair);
            const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
            const pair = getNftPairMockImplementation(Networks.MAINNET, "cloneAddress");
            assetMock = jest.spyOn(pair, "asset").mockResolvedValueOnce("assetAddress");
            collateralMock = jest.spyOn(pair, "collateral").mockResolvedValueOnce("collateralAddress");

            findOrCreateAssetMock = jest.spyOn(assetEntityHelpersService, "findOrCreateAsset").mockResolvedValueOnce({} as AssetEntity);
            findOrCreateCollateralMock = jest.spyOn(collateralEntityHelpersService, "findOrCreateCollateral").mockResolvedValueOnce({} as CollateralEntity);
            createMock = jest.spyOn(cauldronEntityService, "create");
            actual$ = bentoboxSyncService.parseLogs(bentoboxMock, [{ blockNumber: 1}] as Log[]);
        });

        it("should return void", async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it("should call getBentobox", async () => {
            await actual$;
            expect(getBentoboxMock).toHaveBeenCalledTimes(1);
            expect(getBentoboxMock).toHaveBeenCalledWith(bentoboxMock.network, bentoboxMock.address);
        });

        it("should call parseLog", async () => {
            await actual$;
            expect(parseLogMock).toHaveBeenCalledTimes(1);
            expect(parseLogMock).toHaveBeenCalledWith({ blockNumber: 1});
        });

        it("should call create", async () => {
            await actual$;
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith({ bentobox: bentoboxMock, address: "cloneAddress", creationBlock: 1, network: bentoboxMock.network, masterContract: "masterContract", asset: {}, collateral: {}, canSync: false, deprecated: false, checked: false, oracle: false });
        });

        it("should call isAddressInArray", async () => {
            await actual$;
            expect(isAddressInArrayMock).toHaveBeenCalledTimes(1);
            expect(isAddressInArrayMock).toHaveBeenCalledWith("masterContract",  masterContracts[bentoboxMock.network]);
        });

        it("should call getNftPair", async () => {
            await actual$;
            expect(getNftPairMock).toHaveBeenCalledTimes(1);
            expect(getNftPairMock).toHaveBeenCalledWith(Networks.MAINNET, "cloneAddress");
        });

        it("should call asset", async () => {
            await actual$;
            expect(assetMock).toHaveBeenCalledTimes(1);
        });

        it("should call findOrCreateAsset", async () => {
            await actual$;
            expect(findOrCreateAssetMock).toHaveBeenCalledTimes(1);
            expect(findOrCreateAssetMock).toHaveBeenCalledWith(Networks.MAINNET, "assetAddress");
        });

        it("should call collateral", async () => {
            await actual$;
            expect(collateralMock).toHaveBeenCalledTimes(1);
        });

        it("should call findOrCreateCollateral", async () => {
            await actual$;
            expect(findOrCreateCollateralMock).toHaveBeenCalledTimes(1);
            expect(findOrCreateCollateralMock).toHaveBeenCalledWith(Networks.MAINNET, "collateralAddress");
        });
    })
});