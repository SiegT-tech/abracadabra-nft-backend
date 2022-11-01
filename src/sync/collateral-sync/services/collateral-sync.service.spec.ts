import { Test } from "@nestjs/testing";
import { BigNumber } from "nestjs-ethers";

import { CauldronEntityService } from "../../../common/db/cauldron-entity/services/cauldron-entity.service";
import { CollateralEntity } from "../../../common/db/collateral-entity/dao/collateral.entity";
import { CollateralEntityService } from '../../../common/db/collateral-entity/services/collateral-entity.service';
import { NftHelpersEntityService } from '../../../common/db/nft-entity/services/nft-entity-helpers.service';
import { NftEntityService } from '../../../common/db/nft-entity/services/nft-entity.service';
import { OfferEntityService } from "../../../common/db/offer-entity/services/offer-entity.service";
import { CollateralEvents, Networks } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { Collateral } from "../../../typechain";
import * as utils from "../../../utils/is-address-in-array";

import { CollateralSyncService } from "./collateral-sync.service";

describe("CollateralSyncService", () => {
    let collateralSyncService: CollateralSyncService;
    let blockchainService: BlockchainService;
    let collateralEntityService: CollateralEntityService;
    let nftHelpersEntityService: NftHelpersEntityService;
    let nftEntityService: NftEntityService;
    let cauldronEntityService: CauldronEntityService;
    let offerEntityService: OfferEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralSyncService, BlockchainService, CollateralEntityService, NftEntityService, CauldronEntityService, OfferEntityService, NftHelpersEntityService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getCollateral: jest.fn
            })
            .overrideProvider(CollateralEntityService)
            .useValue({
                updateOne: jest.fn
            })
            .overrideProvider(NftHelpersEntityService)
            .useValue({
                findOrCreateNft: jest.fn
            })
            .overrideProvider(NftEntityService)
            .useValue({
                updateOne: jest.fn
            })
            .overrideProvider(CauldronEntityService)
            .useValue({
                read: jest.fn
            })
            .overrideProvider(OfferEntityService)
            .useValue({
                delete: jest.fn
            })
            .compile();
        
        collateralSyncService = moduleRef.get(CollateralSyncService);
        blockchainService = moduleRef.get(BlockchainService);
        collateralEntityService = moduleRef.get(CollateralEntityService);
        nftHelpersEntityService = moduleRef.get(NftHelpersEntityService);
        nftEntityService = moduleRef.get(NftEntityService);
        cauldronEntityService = moduleRef.get(CauldronEntityService);
        offerEntityService = moduleRef.get(OfferEntityService);
    });

    describe("parseLogs", () => {
        const collateralMock = {
            address: "address",
            network: Networks.MAINNET
        } as CollateralEntity;

        describe(CollateralEvents.Transfer, () => {
            let actual$: Promise<void>;
            let getCollateralMock: jest.SpyInstance<Collateral, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let readMock: jest.SpyInstance;
            let collateralUpdateOneMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let nftEntityUpdateOneMock: jest.SpyInstance;
            let isAddressInArrayMock: jest.SpyInstance;
            let deleteMock: jest.SpyInstance;

            beforeEach(() => {
                getCollateralMock = jest.spyOn(blockchainService, "getCollateral").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    }
                } as unknown as Collateral);

                const getCollateralMockImplementation = getCollateralMock.getMockImplementation();
                const pair = getCollateralMockImplementation(Networks.MAINNET, collateralMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CollateralEvents.Transfer,
                    args: {
                        from: "from",
                        to: "to",
                        tokenId: BigNumber.from("0"),
                    }
                } as any);
                readMock = jest.spyOn(cauldronEntityService, "read").mockResolvedValueOnce([]);
                collateralUpdateOneMock = jest.spyOn(collateralEntityService, "updateOne");
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, "findOrCreateNft").mockResolvedValueOnce({} as any);
                nftEntityUpdateOneMock = jest.spyOn(nftEntityService, "updateOne");
                isAddressInArrayMock = jest.spyOn(utils, "isAddressInArray").mockReturnValue(false);
                deleteMock = jest.spyOn(offerEntityService, "delete");
                actual$ = collateralSyncService.parseLogs(collateralMock, [{} as any]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getCollateral", async () => {
                await actual$;
                expect(getCollateralMock).toHaveBeenCalledTimes(1);
                expect(getCollateralMock).toHaveBeenCalledWith(collateralMock.network, collateralMock.address);
            });

            it("should call read", async () => {
                await actual$;
                expect(readMock).toHaveBeenCalledTimes(1);
                expect(readMock).toHaveBeenCalledWith({ network: collateralMock.network });
            });

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({});
            });

            it("should call updateOne", async () => {
                await actual$;
                expect(collateralUpdateOneMock).toHaveBeenCalledTimes(0);
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(collateralMock, 0, "to");
            });

            it("should call updateOne", async () => {
                await actual$;
                expect(nftEntityUpdateOneMock).toHaveBeenCalledTimes(1);
                expect(nftEntityUpdateOneMock).toHaveBeenCalledWith({ id: undefined }, { owner: "to" });
            });

            it("should call isAddressInArray", async () => {
                await actual$;
                expect(isAddressInArrayMock).toHaveBeenCalledTimes(2);
                expect(isAddressInArrayMock).toHaveBeenCalledWith("to", []);
                expect(isAddressInArrayMock).toHaveBeenCalledWith("from", []);
            });

            it("should call delete", async () => {
                await actual$;
                expect(deleteMock).toHaveBeenCalledTimes(1);
                expect(deleteMock).toHaveBeenCalledWith({ nft: {} });
            });
        })
    })
})