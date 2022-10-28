import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OfferCheckerTaskService } from './offer-checker-task.service';

@Injectable()
export class OfferCheckerTaskCreatorService {
    constructor(private readonly offerCheckerTaskService: OfferCheckerTaskService) {}

    @Cron(CronExpression.EVERY_SECOND)
    public deleteExpireOffers() {
        return this.offerCheckerTaskService.deleteExpireOffers();
    }
}
