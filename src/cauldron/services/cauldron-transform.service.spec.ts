import { Test } from '@nestjs/testing';

import { AssetTransformerService } from '../../asset/services/asset-transformer.service';
import { CollateralTransformerService } from '../../collateral/services/collateral-transformer.service';
import { NftTransformService } from '../../nft/services/nft-transform-service';

import { CauldronTransformService } from './cauldron-transform.service';

import { CauldronEntity } from '../dao/cauldron.entity';

describe('CauldronTransformService', () => {
    let cauldronTransformService: CauldronTransformService;
    let assetTransformerService: AssetTransformerService;
    let collateralTransformerService: CollateralTransformerService;
    let nftTransformService: NftTransformService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetTransformerService, CauldronTransformService, CollateralTransformerService, NftTransformService],
        })
            .overrideProvider(AssetTransformerService)
            .useValue({
                toAsset: jest.fn,
            })
            .overrideProvider(CollateralTransformerService)
            .useValue({
                toCollateral: jest.fn,
            })
            .overrideProvider(NftTransformService)
            .useValue({
                toNft: jest.fn,
            })
            .compile();

        assetTransformerService = moduleRef.get(AssetTransformerService);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
        collateralTransformerService = moduleRef.get(CollateralTransformerService);
        nftTransformService = moduleRef.get(NftTransformService);
    });

    describe('toCauldronWithPagination', () => {
        let actual$: any;
        let toCauldronMock: jest.SpyInstance;

        beforeEach(() => {
            toCauldronMock = jest.spyOn(cauldronTransformService, 'toCauldron').mockReturnValue({} as any);
            actual$ = () => cauldronTransformService.toCauldronWithPagination({ cauldrons: [{} as CauldronEntity], pagination: {} });
        });

        it('should return value', () => {
            const actual = actual$();
            expect(actual).toEqual({ cauldrons: [{}], pagination: {} });
        });

        it('should call toCauldron', async () => {
            actual$();

            expect(toCauldronMock).toHaveBeenCalledTimes(1);
            expect(toCauldronMock).toHaveBeenCalledWith({});
        });
    });

    describe('toCauldron', () => {
        let actual$: any;
        let toAssetMock: jest.SpyInstance;
        let toCollateralMock: jest.SpyInstance;
        let toNftMock: jest.SpyInstance;

        const cauldronMock = { collateral: { totalSupply: 1, idsStartFrom: 0, nfts: [{}] }, asset: {} } as CauldronEntity;

        beforeEach(() => {
            toAssetMock = jest.spyOn(assetTransformerService, 'toAsset').mockReturnValueOnce({} as any);
            toCollateralMock = jest.spyOn(collateralTransformerService, 'toCollateral').mockReturnValueOnce({} as any);
            toNftMock = jest.spyOn(nftTransformService, 'toNft').mockReturnValue({} as any);
            actual$ = () => cauldronTransformService.toCauldron(cauldronMock);
        });

        it('should return value', async () => {
            const actual = actual$();
            expect(actual).toEqual({
                address: undefined,
                asset: {},
                collateral: {},
                deprecated: undefined,
                id: undefined,
                masterContract: undefined,
                network: undefined,
                nfts: [{}],
            });
        });

        it('should call toAsset', async () => {
            actual$();

            expect(toAssetMock).toHaveBeenCalledTimes(1);
            expect(toAssetMock).toHaveBeenCalledWith({});
        });

        it('should call toCollateral', async () => {
            actual$();

            expect(toCollateralMock).toHaveBeenCalledTimes(1);
            expect(toCollateralMock).toHaveBeenCalledWith({ totalSupply: 1, idsStartFrom: 0, ...cauldronMock.collateral });
        });

        it('should call toNft', async () => {
            actual$();

            expect(toNftMock).toHaveBeenCalledTimes(1);
            expect(toNftMock).toHaveBeenCalledWith({});
        });
    });
});
