import { Global, Module } from '@nestjs/common';

import { CauldronController } from './cauldron.controller';
import { CauldronHandler } from './cauldron.handler';
import { CauldronTransformService } from './services/cauldron-transform.service';

@Global()
@Module({
    providers: [CauldronHandler, CauldronTransformService],
    controllers: [CauldronController],
    exports: [CauldronTransformService],
})
export class CauldronModule {}
