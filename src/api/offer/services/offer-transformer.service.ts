import { Injectable } from '@nestjs/common';

import { OfferEntity } from '../../../common/db/offer-entity/dao/offer.entity';
import { getTimeNowSec } from '../../../utils';

@Injectable()
export class OfferTransformerService {
    public toOffer({ id, network, address, deadline, duration, valuation, annualInterestBPS, signature, type, anyTokenId, cauldron, ltvBPS, oracle }: OfferEntity) {
        const now = getTimeNowSec();

        const offer = {
            id,
            network,
            address,
            deadline,
            duration,
            valuation,
            annualInterestBPS,
            signature,
            type,
            anyTokenId,
            isExpired: now > deadline,
            cauldronId: undefined,
            ltvBPS,
            oracle,
        };

        if (cauldron) {
            offer.cauldronId = cauldron.id;
        }

        return offer;
    }
}
