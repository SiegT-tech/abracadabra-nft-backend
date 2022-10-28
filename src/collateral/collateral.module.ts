import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollateralController } from './collateral.controller';
import { CollateralHandler } from './collateral.handler';
import { CollateralEntity } from './dao/collateral.entity';
import { CollateralApiService } from './services/collateral-api.service';
import { CollateralBlockchainService } from './services/collateral-blockchain.service';
import { CollateralHelpersService } from './services/collateral-helpers.service';
import { CollateralTransformerService } from './services/collateral-transformer.service';
import { CollateralUtilsService } from './services/collateral-utils.service';
import { CollateralService } from './services/collateral.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
    controllers: [CollateralController],
    imports: [TypeOrmModule.forFeature([CollateralEntity]), HttpModule],
    providers: [CollateralService, CollateralHelpersService, CollateralBlockchainService, CollateralTransformerService, CollateralHandler, CollateralUtilsService, CollateralApiService],
    exports: [CollateralHelpersService, CollateralTransformerService, CollateralService, CollateralApiService],
})
export class CollateralModule {}
