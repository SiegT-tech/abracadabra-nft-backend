import { Test } from '@nestjs/testing';

import { BentoboxEntity } from '../../../common/db/bentobox-entity/dao/bentobox.entity';

import { BentoboxSyncUtilsService } from './bentobox-sync-utils.service';

describe('PairSyncUtilsService', () => {
    let bentoboxSyncUtilsService: BentoboxSyncUtilsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BentoboxSyncUtilsService],
        }).compile();

        bentoboxSyncUtilsService = moduleRef.get(BentoboxSyncUtilsService);
    });

    describe('isPairSyncing', () => {
        const bentobox = { id: 'id ' } as BentoboxEntity;

        it('should return false', () => {
            const status = bentoboxSyncUtilsService.isBentoboxSyncing(bentobox);
            expect(status).toEqual(false);
        });

        it('should return true', () => {
            bentoboxSyncUtilsService.setBentoboxSyncingState(bentobox, true);
            const status = bentoboxSyncUtilsService.isBentoboxSyncing(bentobox);
            expect(status).toEqual(true);
        });
    });

    describe('setPairSyncingState', () => {
        const bentobox = { id: 'id ' } as BentoboxEntity;

        it('should return true', () => {
            bentoboxSyncUtilsService.setBentoboxSyncingState(bentobox, true);
            const status = bentoboxSyncUtilsService.isBentoboxSyncing(bentobox);
            expect(status).toEqual(true);
        });
    });
});
