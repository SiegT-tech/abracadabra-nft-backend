import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NftAttributesEntity } from './dao/nft-attributes.entity';
import { NftEntity } from './dao/nft.entity';
import { NftAttributesEntityHelpersService } from './services/nft-attributes-entity-helpers.service';
import { NftAttributesEntityService } from './services/nft-attributes-entity.service';
import { NftHelpersEntityService } from './services/nft-entity-helpers.service';
import { NftEntityService } from './services/nft-entity.service';

const PROVIDERS = [NftAttributesEntityService, NftEntityService, NftAttributesEntityHelpersService, NftHelpersEntityService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([NftEntity, NftAttributesEntity]), HttpModule],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class NftEntityModule {}
