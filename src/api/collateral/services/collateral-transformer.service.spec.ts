import { Test } from '@nestjs/testing';

import { CollateralEntity } from '../../../common/db/collateral-entity/dao/collateral.entity';
import { CauldronTransformService } from '../../cauldron/services/cauldron-transform.service';
import { NftAttributesTransformerService } from '../../nft/services/nft-attributes-transformer.service';

import { CollateralTransformerService } from './collateral-transformer.service';
import { NftEntityService } from "../../../common/db/nft-entity/services/nft-entity.service";

describe('CollateralTransformerService', () => {
    let collateralTransformerService: CollateralTransformerService;
    let nftAttributesTransformerService: NftAttributesTransformerService;
    let cauldronTransformService: CauldronTransformService;
    let nftEntityService: NftEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralTransformerService, NftAttributesTransformerService, CauldronTransformService, NftEntityService],
        })
            .overrideProvider(NftAttributesTransformerService)
            .useValue({
                toCollateralAttributesList: jest.fn,
            })
            .overrideProvider(CauldronTransformService)
            .useValue({
                toCauldron: jest.fn,
            })
            .overrideProvider(NftEntityService)
            .useValue({
                getNftImages: jest.fn
            })
            .compile();

        collateralTransformerService = moduleRef.get(CollateralTransformerService);
        nftAttributesTransformerService = moduleRef.get(NftAttributesTransformerService);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
        nftEntityService = moduleRef.get(NftEntityService);
    });

    describe('toCollateral', () => {
        let toCollateralAttributesListMock: jest.SpyInstance;
        let toCauldronMock: jest.SpyInstance;
        let getNftImagesMock: jest.SpyInstance;
        let actual$: Promise<any>;

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
            toCauldronMock = jest.spyOn(cauldronTransformService, 'toCauldron').mockResolvedValueOnce({} as any);
            getNftImagesMock = jest.spyOn(nftEntityService, 'getNftImages').mockResolvedValueOnce([]);
            actual$ = collateralTransformerService.toCollateral(mock);
        });

        it('should return value', async () => {
            const actual = await actual$;
            expect(actual).toEqual({ id: 'id', name: 'name', totalSupply: 1, address: 'address', logo: 'logo', idsStartFrom: 1, cauldrons: [{}], nftAttributes: [], banner: undefined, floorPrice: undefined, images: [] });
        });

        it('should call toCollateralAttributesList', async () => {
            await actual$;
            expect(toCollateralAttributesListMock).toBeCalledTimes(1);
            expect(toCollateralAttributesListMock).toBeCalledWith(mock.nftAttributes);
        });

        it('should call toCauldron', async () => {
            await actual$;
            expect(toCauldronMock).toBeCalledTimes(1);
        });

        it('should call getNftImages', async () => {
            await actual$;
            expect(getNftImagesMock).toBeCalledTimes(1);
            expect(getNftImagesMock).toHaveBeenCalledWith(mock.id);
        });
    });
});
