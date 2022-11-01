import { Global, Module } from '@nestjs/common';

import { OfferCheckerTaskCreatorService } from './services/offer-checker-task-creator.service';
import { OfferCheckerTaskService } from './services/offer-checker-task.service';

@Global()
@Module({
    providers: [OfferCheckerTaskService, OfferCheckerTaskCreatorService],
})
export class OfferCheckerModule {}
