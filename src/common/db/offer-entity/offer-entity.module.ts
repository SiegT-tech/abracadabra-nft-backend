import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OfferEntity } from './dao/offer.entity';
import { OfferEntityService } from './services/offer-entity.service';

const PROVIDERS = [OfferEntityService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([OfferEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class OfferEntityModule {}
