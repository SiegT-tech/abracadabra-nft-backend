import { Test } from '@nestjs/testing';

import { CauldronEntity } from '../../../common/db/cauldron-entity/dao/cauldron.entity';
import { AssetTransformerService } from '../../asset/services/asset-transformer.service';
import { CollateralTransformerService } from '../../collateral/services/collateral-transformer.service';

import { CauldronTransformService } from './cauldron-transform.service';

describe('CauldronTransformService', () => {
    let cauldronTransformService: CauldronTransformService;
    let assetTransformerService: AssetTransformerService;
    let collateralTransformerService: CollateralTransformerService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetTransformerService, CauldronTransformService, CollateralTransformerService],
        })
            .overrideProvider(AssetTransformerService)
            .useValue({
                toAsset: jest.fn,
            })
            .overrideProvider(CollateralTransformerService)
            .useValue({
                toCollateral: jest.fn,
            })
            .compile();

        assetTransformerService = moduleRef.get(AssetTransformerService);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
        collateralTransformerService = moduleRef.get(CollateralTransformerService);
    });

    describe('toCauldronWithPagination', () => {
        let actual$: Promise<any>;
        let toCauldronMock: jest.SpyInstance;

        beforeEach(() => {
            toCauldronMock = jest.spyOn(cauldronTransformService, 'toCauldron').mockReturnValue({} as any);
            actual$ = cauldronTransformService.toCauldronWithPagination({ cauldrons: [{} as CauldronEntity], pagination: {} });
        });

        it('should return value', async () => {
            const actual = await actual$;
            expect(actual).toEqual({ cauldrons: [{}], pagination: {} });
        });

        it('should call toCauldron', async () => {
            await actual$;

            expect(toCauldronMock).toHaveBeenCalledTimes(1);
            expect(toCauldronMock).toHaveBeenCalledWith({});
        });
    });

    describe('toCauldron', () => {
        let actual$: Promise<any>;
        let toAssetMock: jest.SpyInstance;
        let toCollateralMock: jest.SpyInstance;

        const cauldronMock = { collateral: { totalSupply: 1, idsStartFrom: 0, nfts: [{}] }, asset: {} } as CauldronEntity;

        beforeEach(() => {
            toAssetMock = jest.spyOn(assetTransformerService, 'toAsset').mockReturnValueOnce({} as any);
            toCollateralMock = jest.spyOn(collateralTransformerService, 'toCollateral').mockReturnValueOnce({} as any);
            actual$ = cauldronTransformService.toCauldron(cauldronMock);
        });

        it('should return value', async () => {
            const actual = await actual$;
            expect(actual).toEqual({
                address: undefined,
                asset: {},
                collateral: {},
                deprecated: undefined,
                id: undefined,
                masterContract: undefined,
                network: undefined,
                oracle: undefined,
            });
        });

        it('should call toAsset', async () => {
            await actual$;

            expect(toAssetMock).toHaveBeenCalledTimes(1);
            expect(toAssetMock).toHaveBeenCalledWith({});
        });

        it('should call toCollateral', async () => {
            await actual$;

            expect(toCollateralMock).toHaveBeenCalledTimes(1);
            expect(toCollateralMock).toHaveBeenCalledWith({ totalSupply: 1, idsStartFrom: 0, ...cauldronMock.collateral });
        });
    });
});
