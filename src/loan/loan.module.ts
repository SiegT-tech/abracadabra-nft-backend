import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanEntity } from './dao/loan.entity';
import { LoanTransformerService } from './services/loan-transformer.service';
import { LoanService } from './services/loan.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LoanEntity])],
    providers: [LoanService, LoanTransformerService],
    exports: [LoanService, LoanTransformerService],
})
export class LoanModule {}
