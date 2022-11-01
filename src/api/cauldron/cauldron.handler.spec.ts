import { Test } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import { CauldronWithPagination } from '../../common/db/cauldron-entity/interfaces/cauldron-with-pagination.interface';
import { CauldronEntityService } from '../../common/db/cauldron-entity/services/cauldron-entity.service';

import { CauldronHandler } from './cauldron.handler';
import { CauldronTransformService } from './services/cauldron-transform.service';

describe('CauldronHandler', () => {
    let cauldronHandler: CauldronHandler;
    let cauldronTransformService: CauldronTransformService;
    let cauldronEntityService: CauldronEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronHandler, CauldronTransformService, CauldronEntityService],
        })
            .overrideProvider(CauldronTransformService)
            .useValue({
                toCauldronWithPagination: jest.fn,
            })
            .overrideProvider(CauldronEntityService)
            .useValue({
                getPairs: jest.fn,
            })
            .compile();

        cauldronHandler = moduleRef.get(CauldronHandler);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
        cauldronEntityService = moduleRef.get(CauldronEntityService);
    });

    describe('getCauldrons', () => {
        let actual$: Observable<any>;
        let getPairsMock: jest.SpyInstance;
        let toCauldronWithPaginationMock: jest.SpyInstance;

        beforeEach(() => {
            getPairsMock = jest.spyOn(cauldronEntityService, 'getPairs').mockReturnValueOnce(of({} as CauldronWithPagination));
            toCauldronWithPaginationMock = jest.spyOn(cauldronTransformService, 'toCauldronWithPagination').mockResolvedValueOnce({} as any);
            actual$ = cauldronHandler.getCauldrons({ filters: {}, pagination: {} });
        });

        it('should return cauldrons', async () => {
            const actual = await actual$.toPromise();
            expect(actual).toEqual({});
        });

        it('should call getPairs', async () => {
            await actual$.toPromise();

            expect(getPairsMock).toHaveBeenCalledTimes(1);
            expect(getPairsMock).toHaveBeenCalledWith({}, {});
        });

        it('should call toCauldronWithPagination', async () => {
            await actual$.toPromise();

            expect(toCauldronWithPaginationMock).toHaveBeenCalledTimes(1);
            expect(toCauldronWithPaginationMock).toHaveBeenCalledWith({});
        });
    });
});
