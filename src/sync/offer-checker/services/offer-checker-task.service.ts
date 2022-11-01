import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';

import { OfferEntityService } from '../../../common/db/offer-entity/services/offer-entity.service';
import { getTimeNowSec } from '../../../utils';

@Injectable()
export class OfferCheckerTaskService {
    constructor(private readonly offerEntityService: OfferEntityService) {}

    public async deleteExpireOffers() {
        const now = getTimeNowSec();
        await this.offerEntityService.delete({ deadline: LessThan(now) });
    }
}
