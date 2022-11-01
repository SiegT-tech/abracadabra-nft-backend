import { Module, Global } from '@nestjs/common';

import { AssetController } from './asset.controller';
import { AssetHandler } from './asset.handler';
import { AssetTransformerService } from './services/asset-transformer.service';

@Global()
@Module({
    providers: [AssetTransformerService, AssetHandler],
    exports: [AssetTransformerService],
    controllers: [AssetController],
})
export class AssetModule {}
