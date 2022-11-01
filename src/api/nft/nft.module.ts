import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { NftController } from './nft.controller';
import { NftHandler } from './nft.handler';
import { NftAttributesTransformerService } from './services/nft-attributes-transformer.service';
import { NftTransformService } from './services/nft-transform-service';

const PROVIDERS = [NftAttributesTransformerService, NftTransformService];

@Global()
@Module({
    imports: [HttpModule],
    providers: [...PROVIDERS, NftHandler],
    controllers: [NftController],
    exports: PROVIDERS,
})
export class NftModule {}
