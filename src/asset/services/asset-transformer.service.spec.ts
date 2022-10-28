import { Test } from '@nestjs/testing';

import { AssetTransformerService } from './asset-transformer.service';

import { AssetEntity } from '../dao/asset.entity';

describe('AssetTransformerService', () => {
    let assetTransformerService: AssetTransformerService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetTransformerService],
        }).compile();

        assetTransformerService = moduleRef.get(AssetTransformerService);
    });

    describe('toAsset', () => {
        it('should retun asset', () => {
            const actual = assetTransformerService.toAsset({} as AssetEntity);
            expect(actual).toEqual({});
        });
    });

    describe('toAssetWithPagination', () => {
        it('should retun assets', () => {
            const actual = assetTransformerService.toAssetWithPagination({ assets: [], pagination: {} });
            expect(actual).toEqual({ assets: [], pagination: {} });
        });
    });
});
