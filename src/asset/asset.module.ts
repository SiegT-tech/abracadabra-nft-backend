import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetController } from './asset.controller';
import { AssetHandler } from './asset.handler';
import { AssetEntity } from './dao/asset.entity';
import { AssetBlockchainService } from './services/asset-blockchain.service';
import { AssetHelpersService } from './services/asset-helpers.service';
import { AssetTransformerService } from './services/asset-transformer.service';
import { AssetService } from './services/asset.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AssetEntity])],
    providers: [AssetService, AssetBlockchainService, AssetHelpersService, AssetTransformerService, AssetHandler],
    exports: [AssetHelpersService, AssetTransformerService],
    controllers: [AssetController],
})
export class AssetModule {}
