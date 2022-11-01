import { Test } from '@nestjs/testing';
import { LessThan } from 'typeorm';

import { OfferEntityService } from '../../../common/db/offer-entity/services/offer-entity.service';
import * as utils from '../../../utils/get-time-now-sec';

import { OfferCheckerTaskService } from './offer-checker-task.service';

describe('OfferCheckerTaskService', () => {
    let offerCheckerTaskService: OfferCheckerTaskService;
    let offerEntityService: OfferEntityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [OfferCheckerTaskService, OfferEntityService],
        })
            .overrideProvider(OfferEntityService)
            .useValue({
                delete: jest.fn,
            })
            .compile();

        offerCheckerTaskService = moduleRef.get(OfferCheckerTaskService);
        offerEntityService = moduleRef.get(OfferEntityService);
    });

    describe('deleteExpireOffers', () => {
        let getTimeNowSecMock: jest.SpyInstance;
        let deleteMock: jest.SpyInstance;
        let actual$: Promise<void>;

        beforeEach(() => {
            getTimeNowSecMock = jest.spyOn(utils, 'getTimeNowSec').mockReturnValue(100);
            deleteMock = jest.spyOn(offerEntityService, 'delete').mockResolvedValueOnce({} as any);
            actual$ = offerCheckerTaskService.deleteExpireOffers();
        });

        it('should return void', async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it('should call getTimeNowSec', async () => {
            await actual$;
            expect(getTimeNowSecMock).toBeCalledTimes(1);
        });

        it('should call delete', async () => {
            await actual$;
            expect(deleteMock).toHaveBeenCalledTimes(1);
            expect(deleteMock).toHaveBeenCalledWith({ deadline: LessThan(100) });
        });
    });
});
