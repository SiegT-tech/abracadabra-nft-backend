import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { CollateralController } from './collateral.controller';
import { CollateralHandler } from './collateral.handler';
import { CollateralTransformerService } from './services/collateral-transformer.service';

const PROVIDERS = [CollateralTransformerService];

@Global()
@Module({
    controllers: [CollateralController],
    imports: [HttpModule],
    providers: [...PROVIDERS, CollateralHandler],
    exports: PROVIDERS,
})
export class CollateralModule {}
