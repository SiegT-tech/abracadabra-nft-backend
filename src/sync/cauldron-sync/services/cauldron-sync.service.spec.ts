import { Test } from "@nestjs/testing";
import { AddressZero, BigNumber, Log } from "nestjs-ethers";

import { CauldronEntity } from "../../../common/db/cauldron-entity/dao/cauldron.entity";
import { LoanEntityService} from "../../../common/db/loan-entity/services/loan-entity.service";
import { LoanStatus } from "../../../common/db/loan-entity/types";
import { NftHelpersEntityService } from '../../../common/db/nft-entity/services/nft-entity-helpers.service';
import { OfferEntityService } from '../../../common/db/offer-entity/services/offer-entity.service';
import { Networks , CauldronEvents } from "../../../common/modules/blockchain/constants";
import { BlockchainService } from "../../../common/modules/blockchain/services/blockchain.service";
import { NFTPair } from "../../../typechain";

import { CauldronSyncService } from "./cauldron-sync.service";

describe("CauldronSyncService", () => {
    let cauldronSyncService: CauldronSyncService;
    let blockchainService: BlockchainService;
    let loanEntityService: LoanEntityService;
    let nftHelpersEntityService: NftHelpersEntityService;
    let offerEntityService: OfferEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronSyncService, BlockchainService, LoanEntityService, NftHelpersEntityService, OfferEntityService],
        })
            .overrideProvider(BlockchainService)
            .useValue({
                getNftPair: jest.fn,
                getTimestamp: jest.fn
            })
            .overrideProvider(LoanEntityService)
            .useValue({
                create: jest.fn,
                updateOne: jest.fn,
                delete: jest.fn,
                readOne: jest.fn,
            })
            .overrideProvider(NftHelpersEntityService)
            .useValue({
                findOrCreateNft: jest.fn
            })
            .overrideProvider(OfferEntityService)
            .useValue({
                delete: jest.fn
            })
            .compile();

        cauldronSyncService = moduleRef.get(CauldronSyncService);
        blockchainService = moduleRef.get(BlockchainService);
        loanEntityService = moduleRef.get(LoanEntityService);
        nftHelpersEntityService = moduleRef.get(NftHelpersEntityService);
        offerEntityService = moduleRef.get(OfferEntityService);
    });

    describe("parseLogs", () => {
        describe(CauldronEvents.LogRequestLoan, () => {
            let actual$: Promise<void>;
            let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let createMock: jest.SpyInstance;

            const cauldronMock = { network: Networks.MAINNET, address: "address", collateral: {} } as CauldronEntity;

            beforeEach(() => {
                getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    }
                } as unknown as NFTPair);

                const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
                const pair = getNftPairMockImplementation(Networks.MAINNET, cauldronMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CauldronEvents.LogRequestLoan,
                    args: {
                        borrower: "borrower",
                        tokenId: BigNumber.from("0"),
                        params: {
                            duration: BigNumber.from("0"),
                            valuation: BigNumber.from("0"),
                            annualInterestBPS: 0
                        }
                    }
                } as any);
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, 'findOrCreateNft').mockResolvedValueOnce({} as any);
                createMock = jest.spyOn(loanEntityService, "create");
                actual$ = cauldronSyncService.parseLogs(cauldronMock, [{}] as Log[]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getNftPair", async () => {
                await actual$;
                expect(getNftPairMock).toHaveBeenCalledTimes(1);
                expect(getNftPairMock).toHaveBeenCalledWith(cauldronMock.network, cauldronMock.address);
            })

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({});
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(cauldronMock.collateral, 0);
            })

            it("should call create", async () => {
                await actual$;
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith({
                    borrower: "borrower",
                    startTime: 0,
                    lender: AddressZero,
                    duration: 0,
                    status: LoanStatus.LOAN_REQUESTED,
                    network: cauldronMock.network,
                    cauldron: cauldronMock,
                    valuation: 0,
                    annualInterestBPS: 0,
                    nft: {}
                });
            });
        });

        describe(CauldronEvents.LogUpdateLoanParams, () => {
            let actual$: Promise<void>;
            let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let updateOneMock: jest.SpyInstance;

            const cauldronMock = { network: Networks.MAINNET, address: "address", collateral: {} } as CauldronEntity;

            beforeEach(() => {
                getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    }
                } as unknown as NFTPair);

                const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
                const pair = getNftPairMockImplementation(Networks.MAINNET, cauldronMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CauldronEvents.LogUpdateLoanParams,
                    args: {
                        tokenId: BigNumber.from("0"),
                        params: {
                            duration: BigNumber.from("0"),
                            valuation: BigNumber.from("0"),
                            annualInterestBPS: 0
                        }
                    }
                } as any);
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, "findOrCreateNft").mockResolvedValueOnce({} as any);
                updateOneMock = jest.spyOn(loanEntityService, "updateOne");
                actual$ = cauldronSyncService.parseLogs(cauldronMock, [{}] as Log[]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getNftPair", async () => {
                await actual$;
                expect(getNftPairMock).toHaveBeenCalledTimes(1);
                expect(getNftPairMock).toHaveBeenCalledWith(cauldronMock.network, cauldronMock.address);
            })

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({});
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(cauldronMock.collateral, 0);
            })

            it("should call update", async () => {
                await actual$;
                expect(updateOneMock).toHaveBeenCalledTimes(1);
                expect(updateOneMock).toHaveBeenCalledWith({ cauldron: cauldronMock, nft: {} }, { duration: 0, annualInterestBPS: 0, valuation: 0 });
            });
        });

        describe(CauldronEvents.LogRemoveCollateral, () => {
            let actual$: Promise<void>;
            let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let deleteMock: jest.SpyInstance;

            const cauldronMock = { network: Networks.MAINNET, address: "address" } as CauldronEntity;

            beforeEach(() => {
                getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    }
                } as unknown as NFTPair);

                const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
                const pair = getNftPairMockImplementation(Networks.MAINNET, cauldronMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CauldronEvents.LogRemoveCollateral,
                    args: {
                        tokenId: BigNumber.from("0"),
                    }
                } as any);
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, "findOrCreateNft").mockResolvedValueOnce({} as any);
                deleteMock = jest.spyOn(loanEntityService, "delete");
                actual$ = cauldronSyncService.parseLogs(cauldronMock, [{}] as Log[]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getNftPair", async () => {
                await actual$;
                expect(getNftPairMock).toHaveBeenCalledTimes(1);
                expect(getNftPairMock).toHaveBeenCalledWith(cauldronMock.network, cauldronMock.address);
            })

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({});
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(cauldronMock.collateral, 0);
            })

            it("should call delete", async () => {
                await actual$;
                expect(deleteMock).toHaveBeenCalledTimes(1);
                expect(deleteMock).toHaveBeenCalledWith({ nft: {}, cauldron: cauldronMock });
            });
        });

        describe(CauldronEvents.LogRepay, () => {
            let actual$: Promise<void>;
            let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let deleteMock: jest.SpyInstance;

            const cauldronMock = { network: Networks.MAINNET, address: "address" } as CauldronEntity;

            beforeEach(() => {
                getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    }
                } as unknown as NFTPair);

                const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
                const pair = getNftPairMockImplementation(Networks.MAINNET, cauldronMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CauldronEvents.LogRepay,
                    args: {
                        tokenId: BigNumber.from("0"),
                    }
                } as any);
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, "findOrCreateNft").mockResolvedValueOnce({} as any);
                deleteMock = jest.spyOn(loanEntityService, "delete");
                actual$ = cauldronSyncService.parseLogs(cauldronMock, [{}] as Log[]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getNftPair", async () => {
                await actual$;
                expect(getNftPairMock).toHaveBeenCalledTimes(1);
                expect(getNftPairMock).toHaveBeenCalledWith(cauldronMock.network, cauldronMock.address);
            })

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({});
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(cauldronMock.collateral, 0);
            })

            it("should call delete", async () => {
                await actual$;
                expect(deleteMock).toHaveBeenCalledTimes(1);
                expect(deleteMock).toHaveBeenCalledWith({ nft: {}, cauldron: cauldronMock });
            });
        });

        describe(CauldronEvents.LogLend, () => {
            let actual$: Promise<void>;
            let getNftPairMock: jest.SpyInstance<NFTPair, [network: Networks, address: string]>;
            let parseLogMock: jest.SpyInstance;
            let getTimestampMock: jest.SpyInstance;
            let findOrCreateNftMock: jest.SpyInstance;
            let deleteLoanMock: jest.SpyInstance;
            let deleteOfferMock: jest.SpyInstance;
            let noncesMock: jest.SpyInstance;
            let createMock: jest.SpyInstance;
            
            const pairMock = { network: Networks.MAINNET, address: "address", collateral: {} } as CauldronEntity;

            beforeEach(() => {
                getNftPairMock = jest.spyOn(blockchainService, "getNftPair").mockReturnValue({
                    interface: {
                        parseLog: jest.fn
                    },
                    currentBatchIds: jest.fn,
                } as unknown as NFTPair);

                const getNftPairMockImplementation = getNftPairMock.getMockImplementation();
                const pair = getNftPairMockImplementation(Networks.MAINNET, pairMock.address);
                parseLogMock = jest.spyOn(pair.interface, "parseLog").mockReturnValue({
                    name: CauldronEvents.LogLend,
                    args: {
                        tokenId: BigNumber.from("0"),
                        lender: "lender",
                        borrower: "borrower",
                        params: {
                            duration: BigNumber.from("0"),
                            valuation: BigNumber.from("0"),
                            annualInterestBPS: 0
                        }
                    }
                } as any);
                getTimestampMock = jest.spyOn(blockchainService, "getTimestamp").mockResolvedValueOnce(0);
                findOrCreateNftMock = jest.spyOn(nftHelpersEntityService, "findOrCreateNft").mockResolvedValueOnce({ } as any);
                noncesMock = jest.spyOn(pair, "currentBatchIds").mockResolvedValue(BigNumber.from(1));
                deleteOfferMock = jest.spyOn(offerEntityService, "delete").mockResolvedValue({} as any);
                deleteLoanMock = jest.spyOn(loanEntityService, "delete").mockResolvedValue({} as any);
                createMock = jest.spyOn(loanEntityService, 'create').mockResolvedValue({} as any);
                actual$ = cauldronSyncService.parseLogs(pairMock, [{ blockNumber: 1 }] as Log[]);
            });

            it("should return void", async () => {
                const actual = await actual$;
                expect(actual).toBeUndefined();
            });

            it("should call getNftPair", async () => {
                await actual$;
                expect(getNftPairMock).toHaveBeenCalledTimes(1);
                expect(getNftPairMock).toHaveBeenCalledWith(pairMock.network, pairMock.address);
            })

            it("should call parseLog", async () => {
                await actual$;
                expect(parseLogMock).toHaveBeenCalledTimes(1);
                expect(parseLogMock).toHaveBeenCalledWith({ blockNumber: 1 });
            });

            it("should call getTimestamp", async () => {
                await actual$;
                expect(getTimestampMock).toHaveBeenCalledTimes(1);
                expect(getTimestampMock).toHaveBeenCalledWith(pairMock.network, 1);
            });

            it("should call findOrCreateNft", async () => {
                await actual$;
                expect(findOrCreateNftMock).toHaveBeenCalledTimes(1);
                expect(findOrCreateNftMock).toHaveBeenCalledWith(pairMock.collateral, 0);
            });

            it("should call nonce", async () => {
                await actual$;
                expect(noncesMock).toHaveBeenCalledTimes(2);
                expect(noncesMock).toHaveBeenCalledWith("lender");
                expect(noncesMock).toHaveBeenCalledWith("borrower");
            });

            it("should call create", async () => {
                await actual$;
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith({
                    borrower: "borrower",
                    startTime: 0,
                    lender: "lender",
                    duration: 0,
                    status: LoanStatus.LOAN_OUTSTANDING,
                    nft: { },
                    network: Networks.MAINNET,
                    cauldron: pairMock,
                    valuation: 0,
                    annualInterestBPS: 0,
                });
            });

            it("should call delete loan", async () => {
                await actual$;
                expect(deleteLoanMock).toHaveBeenCalledTimes(1);
                expect(deleteLoanMock).toHaveBeenCalledWith({ nft: {}, cauldron: pairMock });
            });

            it("should call delete offers", async () => {
                await actual$;
                expect(deleteOfferMock).toHaveBeenCalledTimes(3);
            });
        });
    });
});