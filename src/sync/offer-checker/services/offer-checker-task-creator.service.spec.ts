import { Test } from '@nestjs/testing';

import { OfferCheckerTaskCreatorService } from './offer-checker-task-creator.service';
import { OfferCheckerTaskService } from './offer-checker-task.service';

describe('OfferCheckerTaskCreatorService', () => {
    let offerCheckerTaskService: OfferCheckerTaskService;
    let offerCheckerTaskCreatorService: OfferCheckerTaskCreatorService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [OfferCheckerTaskService, OfferCheckerTaskCreatorService],
        })
            .overrideProvider(OfferCheckerTaskService)
            .useValue({
                deleteExpireOffers: jest.fn,
            })
            .compile();

        offerCheckerTaskService = moduleRef.get(OfferCheckerTaskService);
        offerCheckerTaskCreatorService = moduleRef.get(OfferCheckerTaskCreatorService);
    });

    describe('deleteExpireOffers', () => {
        let deleteExpireOffersMock: jest.SpyInstance;
        let actual$: Promise<void>;

        beforeEach(() => {
            deleteExpireOffersMock = jest.spyOn(offerCheckerTaskService, 'deleteExpireOffers');
            actual$ = offerCheckerTaskCreatorService.deleteExpireOffers();
        });

        it('should return void', async () => {
            const actual = await actual$;
            expect(actual).toBeUndefined();
        });

        it('should call deleteExpireOffers', async () => {
            await actual$;
            expect(deleteExpireOffersMock).toBeCalledTimes(1);
        });
    });
});
