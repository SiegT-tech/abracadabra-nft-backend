import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DbModule } from './db/db.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
    imports: [ScheduleModule.forRoot(), BlockchainModule, ExceptionsModule, LoggerModule, DbModule],
})
export class CommonModule {}
