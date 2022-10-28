import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OfferEntity } from './dao/offer.entity';
import { OfferController } from './offer.controller';
import { OfferHandler } from './offer.handler';
import { OfferTransformerService } from './services/offer-transformer.service';
import { OfferUtilsService } from './services/offer-utils.service';
import { OfferService } from './services/offer.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([OfferEntity])],
    providers: [OfferService, OfferHandler, OfferTransformerService, OfferUtilsService],
    controllers: [OfferController],
    exports: [OfferService, OfferTransformerService],
})
export class OfferModule {}
