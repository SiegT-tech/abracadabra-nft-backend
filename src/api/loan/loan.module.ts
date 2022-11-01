import { Global, Module } from '@nestjs/common';

import { LoanTransformerService } from './services/loan-transformer.service';

const PROVIDERS = [LoanTransformerService];

@Global()
@Module({
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class LoanModule {}
