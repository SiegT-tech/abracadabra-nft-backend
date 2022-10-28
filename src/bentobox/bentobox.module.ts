import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BentoboxEntity } from './dao/bentobox.entity';
import { BentoboxService } from './services/bentobox.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([BentoboxEntity])],
    providers: [BentoboxService],
    exports: [BentoboxService],
})
export class BentoboxModule {}
