import { Test } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import { CauldronHandler } from './cauldron.handler';
import { CauldronWithPagination } from './interfaces/cauldron-with-pagination.interface';
import { CauldronTransformService } from './services/cauldron-transform.service';
import { CauldronService } from './services/cauldron.service';

describe('CauldronHandler', () => {
    let cauldronHandler: CauldronHandler;
    let cauldronTransformService: CauldronTransformService;
    let cauldronService: CauldronService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronHandler, CauldronTransformService, CauldronService],
        })
            .overrideProvider(CauldronTransformService)
            .useValue({
                toCauldronWithPagination: jest.fn,
            })
            .overrideProvider(CauldronService)
            .useValue({
                getPairs: jest.fn,
            })
            .compile();

        cauldronHandler = moduleRef.get(CauldronHandler);
        cauldronTransformService = moduleRef.get(CauldronTransformService);
        cauldronService = moduleRef.get(CauldronService);
    });

    describe('getCauldrons', () => {
        let actual$: Observable<any>;
        let getPairsMock: jest.SpyInstance;
        let toCauldronWithPaginationMock: jest.SpyInstance;

        beforeEach(() => {
            getPairsMock = jest.spyOn(cauldronService, 'getPairs').mockReturnValueOnce(of({} as CauldronWithPagination));
            toCauldronWithPaginationMock = jest.spyOn(cauldronTransformService, 'toCauldronWithPagination').mockReturnValueOnce({} as any);
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
