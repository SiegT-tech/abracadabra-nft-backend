import { Module, Global } from '@nestjs/common';

import { OfferController } from './offer.controller';
import { OfferHandler } from './offer.handler';
import { OfferTransformerService } from './services/offer-transformer.service';
import { OfferUtilsService } from './services/offer-utils.service';

@Global()
@Module({
    providers: [OfferHandler, OfferTransformerService, OfferUtilsService],
    controllers: [OfferController],
    exports: [OfferTransformerService],
})
export class OfferModule {}
