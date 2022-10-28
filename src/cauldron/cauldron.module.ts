import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CauldronController } from './cauldron.controller';
import { CauldronHandler } from './cauldron.handler';
import { CauldronEntity } from './dao/cauldron.entity';
import { CauldronTransformService } from './services/cauldron-transform.service';
import { CauldronService } from './services/cauldron.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([CauldronEntity])],
    providers: [CauldronService, CauldronHandler, CauldronTransformService],
    controllers: [CauldronController],
    exports: [CauldronService, CauldronTransformService],
})
export class CauldronModule {}
