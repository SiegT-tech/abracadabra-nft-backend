import { Test } from '@nestjs/testing';

import { CauldronTransformService } from '../../cauldron/services/cauldron-transform.service';
import { NftAttributesTransformerService } from '../../nft/services/nft-attributes-transformer.service';

import { CollateralTransformerService } from './collateral-transformer.service';

import { CollateralEntity } from '../dao/collateral.entity';

describe('CollateralTransformerService', () => {
    let collateralTransformerService: CollateralTransformerService;
    let nftAttributesTransformerService: NftAttributesTransformerService;
    let cauldronTransformService: CauldronTransformService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralTransformerService, NftAttributesTransformerService, CauldronTransformService],
        })
            .overrideProvider(NftAttributesTransformerService)
            .useValue({
                toCollateralAttributesList: jest.fn,
            })
            .overrideProvider(CauldronTransformService)
            .useValue({
                toCauldron: jest.fn,
            })
            .compile();

        collateralTransformerService = moduleRef.get(CollateralTransformerService);
        nftAttributesTransformerService = moduleRef.get(NftAttributesTransformerService);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
    });

    describe('toCollateral', () => {
        let toCollateralAttributesListMock: jest.SpyInstance;
        let toCauldronMock: jest.SpyInstance;

        const mock = {
            id: 'id',
            name: 'name',
            totalSupply: 1,
            address: 'address',
            idsStartFrom: 1,
            logo: 'logo',
            updatedAt: new Date(),
            nftAttributes: [{ type: 'type', value: 'value' }],
            cauldrons: [{}],
        } as CollateralEntity;

        beforeEach(() => {
            toCollateralAttributesListMock = jest.spyOn(nftAttributesTransformerService, 'toCollateralAttributesList').mockReturnValueOnce([] as any);
            toCauldronMock = jest.spyOn(cauldronTransformService, 'toCauldron').mockReturnValueOnce({} as any);
        });

        it('should return value', () => {
            const actual = collateralTransformerService.toCollateral(mock);
            expect(actual).toEqual({ id: 'id', name: 'name', totalSupply: 1, address: 'address', logo: 'logo', idsStartFrom: 1, cauldrons: [{}], nftAttributes: [] });
        });

        it('should call toCollateralAttributesList', () => {
            collateralTransformerService.toCollateral(mock);
            expect(toCollateralAttributesListMock).toBeCalledTimes(1);
            expect(toCollateralAttributesListMock).toBeCalledWith(mock.nftAttributes);
        });

        it('should call toCauldron', () => {
            collateralTransformerService.toCollateral(mock);
            expect(toCauldronMock).toBeCalledTimes(1);
        });
    });
});
