import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetEntity } from './dao/asset.entity';
import { AssetEntityHelpersService } from './services/asset-entity-helpers.service';
import { AssetEntityService } from './services/asset-entity.service';

const PROVIDERS = [AssetEntityService, AssetEntityHelpersService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AssetEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class AssetEntityModule {}
