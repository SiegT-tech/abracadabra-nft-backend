import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetEntityModule } from './asset-entity/asset-entity.module';
import { BentoboxEntityModule } from './bentobox-entity/bentobox-entity.module';
import { CauldronEntityModule } from './cauldron-entity/cauldron-entity.module';
import { CollateralEntityModule } from './collateral-entity/collateral-entity.module';
import { LoanEntityModule } from './loan-entity/loan-entity.module';
import { NftEntityModule } from './nft-entity/nft-entity.module';
import { OfferEntityModule } from './offer-entity/offer-entity.module';

@Module({
    imports: [TypeOrmModule.forRoot(), AssetEntityModule, BentoboxEntityModule, CauldronEntityModule, CollateralEntityModule, LoanEntityModule, OfferEntityModule, NftEntityModule],
})
export class DbModule {}
