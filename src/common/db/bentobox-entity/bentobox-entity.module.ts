import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BentoboxEntity } from './dao/bentobox.entity';
import { BentoboxEntityService } from './services/bentobox-entity.service';

const PROVIDERS = [BentoboxEntityService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([BentoboxEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class BentoboxEntityModule {}
