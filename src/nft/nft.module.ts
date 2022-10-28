import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NftAttributesEntity } from './dao/nft-attributes.entity';
import { NftEntity } from './dao/nft.entity';
import { NftController } from './nft.controller';
import { NftHandler } from './nft.handler';
import { NftAttributesEntityService } from './services/nft-attributes-entity.service';
import { NftAttributesHelpersService } from './services/nft-attributes-helpers.service';
import { NftAttributesTransformerService } from './services/nft-attributes-transformer.service';
import { NftBlockchainService } from './services/nft-blockchain.service';
import { NftEntityService } from './services/nft-entity.service';
import { NftHelpersService } from './services/nft-helpers.service';
import { NftTransformService } from './services/nft-transform-service';
import { NftUtilsService } from './services/nft-utils.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([NftEntity, NftAttributesEntity]), HttpModule],
    providers: [
        NftTransformService,
        NftUtilsService,
        NftHandler,
        NftEntityService,
        NftAttributesEntityService,
        NftHelpersService,
        NftBlockchainService,
        NftAttributesHelpersService,
        NftAttributesTransformerService,
    ],
    controllers: [NftController],
    exports: [NftUtilsService, NftHelpersService, NftEntityService, NftBlockchainService, NftAttributesTransformerService, NftTransformService],
})
export class NftModule {}
