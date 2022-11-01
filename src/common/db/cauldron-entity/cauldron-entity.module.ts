import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CauldronEntity } from './dao/cauldron.entity';
import { CauldronEntityService } from './services/cauldron-entity.service';

const PROVIDERS = [CauldronEntityService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([CauldronEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class CauldronEntityModule {}
