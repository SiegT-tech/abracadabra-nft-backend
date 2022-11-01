import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollateralEntity } from './dao/collateral.entity';
import { CollateralEntityHelpersService } from './services/collateral-entity-helpers.service';
import { CollateralEntityService } from './services/collateral-entity.service';

const PROVIDERS = [CollateralEntityService, CollateralEntityHelpersService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([CollateralEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class CollateralEntityModule {}
