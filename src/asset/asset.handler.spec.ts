import { Test } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import { AssetHandler } from './asset.handler';
import { AssetWithPagination } from './interfaces/asset-with-pagination.interface';
import { AssetTransformerService } from './services/asset-transformer.service';
import { AssetService } from './services/asset.service';

describe('AssetHandler', () => {
    let assetHandler: AssetHandler;
    let assetService: AssetService;
    let assetTransformerService: AssetTransformerService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetHandler, AssetService, AssetTransformerService],
        })
            .overrideProvider(AssetService)
            .useValue({
                getAssets: jest.fn,
            })
            .overrideProvider(AssetTransformerService)
            .useValue({
                toAssetWithPagination: jest.fn,
            })
            .compile();

        assetHandler = moduleRef.get(AssetHandler);
        assetService = moduleRef.get(AssetService);
        assetTransformerService = moduleRef.get(AssetTransformerService);
    });

    describe('getAssets', () => {
        let actual$: Observable<any>;
        let getAssetsMock: jest.SpyInstance;
        let toAssetWithPaginationMock: jest.SpyInstance;

        beforeEach(() => {
            getAssetsMock = jest.spyOn(assetService, 'getAssets').mockReturnValueOnce(of({} as AssetWithPagination));
            toAssetWithPaginationMock = jest.spyOn(assetTransformerService, 'toAssetWithPagination').mockReturnValueOnce({} as any);
            actual$ = assetHandler.getAssets({ filters: {}, pagination: {} });
        });

        it('should return data', async () => {
            const actual = await actual$.toPromise();
            expect(actual).toEqual({});
        });

        it('should call getAssets', async () => {
            await actual$.toPromise();
            expect(getAssetsMock).toHaveBeenCalledTimes(1);
            expect(getAssetsMock).toHaveBeenCalledWith({}, {});
        });

        it('should call toAssetWithPagination', async () => {
            await actual$.toPromise();
            expect(toAssetWithPaginationMock).toHaveBeenCalledTimes(1);
            expect(toAssetWithPaginationMock).toHaveBeenCalledWith({});
        });
    });
});
