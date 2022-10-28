import { Test } from "@nestjs/testing";
import { BigNumber } from "nestjs-ethers";

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CollateralEvents, Networks } from "../../blockchain/constants";
import { CauldronService } from "../../cauldron/services/cauldron.service";
import { CollateralEntity } from "../../collateral/dao/collateral.entity";
import { CollateralService } from '../../collateral/services/collateral.service';
import { NftEntityService } from '../../nft/services/nft-entity.service';
import { NftHelpersService } from '../../nft/services/nft-helpers.service';
import { OfferService } from "../../offer/services/offer.service";
import { Collateral } from "../../typechain";
import * as utils from "../../utils/is-address-in-array";



import { CollateralSyncService } from "./collateral-sync.service";

describe("CollateralSyncService", () => {
    let collateralSyncService: CollateralSyncService;
    let blockchainService: BlockchainService;
    let collateralService: CollateralService;
    let nftHelpersService: NftHelpersService;
    let nftEntityService: NftEntityService;
    let cauldronService: CauldronService;
    let offerService: OfferService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralSyncService, BlockchainService, CollateralService, NftEntityService, CauldronService, OfferService, NftHelpersService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getCollateral: jest.fn
            })
            .overrideProvider(CollateralService)
            .useValue({
                updateOne: jest.fn
            })
            .overrideProvider(NftHelpersService)
            .useValue({
                findOrCreateNft: jest.fn
            })
            .overrideProvider(NftEntityService)
            .useValue({
                updateOne: jest.fn
            })
            .overrideProvider(CauldronService)
            .useValue({
                read: jest.fn
            })
            .overrideProvider(OfferService)
            .useValue({
                delete: jest.fn
            })
            .compile();
        
        collateralSyncService = moduleRef.get(CollateralSyncService);
        blockchainService = moduleRef.get(BlockchainService);
        collateralService = moduleRef.get(CollateralService);
        nftHelpersService = moduleRef.get(NftHelpersService);
        nftEntityService = moduleRef.get(NftEntityService);
        cauldronService = moduleRef.get(CauldronService);
        offerService = moduleRef.get(OfferService);
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
                readMock = jest.spyOn(cauldronService, "read").mockResolvedValueOnce([]);
                collateralUpdateOneMock = jest.spyOn(collateralService, "updateOne");
                findOrCreateNftMock = jest.spyOn(nftHelpersService, "findOrCreateNft").mockResolvedValueOnce({} as any);
                nftEntityUpdateOneMock = jest.spyOn(nftEntityService, "updateOne");
                isAddressInArrayMock = jest.spyOn(utils, "isAddressInArray").mockReturnValue(false);
                deleteMock = jest.spyOn(offerService, "delete");
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