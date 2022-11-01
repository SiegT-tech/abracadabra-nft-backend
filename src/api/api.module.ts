import { Module } from '@nestjs/common';

import { AssetModule } from './asset/asset.module';
import { CauldronModule } from './cauldron/cauldron.module';
import { CollateralModule } from './collateral/collateral.module';
import { LoanModule } from './loan/loan.module';
import { NftModule } from './nft/nft.module';
import { OfferModule } from './offer/offer.module';

import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule, AssetModule, CauldronModule, CollateralModule, LoanModule, NftModule, OfferModule],
})
export class ApiModule {}
