import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanEntity } from './dao/loan.entity';
import { LoanEntityService } from './services/loan-entity.service';

const PROVIDERS = [LoanEntityService];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LoanEntity])],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class LoanEntityModule {}
