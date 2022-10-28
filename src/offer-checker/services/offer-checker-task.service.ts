import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';

import { OfferService } from '../../offer/services/offer.service';
import { getTimeNowSec } from '../../utils';

@Injectable()
export class OfferCheckerTaskService {
    constructor(private readonly offerService: OfferService) {}

    public deleteExpireOffers() {
        const now = getTimeNowSec();
        return this.offerService.delete({ deadline: LessThan(now) });
    }
}
