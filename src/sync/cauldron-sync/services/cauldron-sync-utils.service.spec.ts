import { Test } from '@nestjs/testing';

import { CauldronEntity } from '../../../common/db/cauldron-entity/dao/cauldron.entity';

import { CauldronSyncUtilsService } from './cauldron-sync-utils.service';

describe('CauldronSyncUtilsService', () => {
    let cauldronSyncUtilsService: CauldronSyncUtilsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CauldronSyncUtilsService],
        }).compile();

        cauldronSyncUtilsService = moduleRef.get(CauldronSyncUtilsService);
    });

    describe('isCauldronSyncing', () => {
        const cauldron = { id: 'id ' } as CauldronEntity;

        it('should return false', () => {
            const status = cauldronSyncUtilsService.isCauldronSyncing(cauldron);
            expect(status).toEqual(false);
        });

        it('should return true', () => {
            cauldronSyncUtilsService.setCauldronSyncingState(cauldron, true);
            const status = cauldronSyncUtilsService.isCauldronSyncing(cauldron);
            expect(status).toEqual(true);
        });
    });

    describe('setCauldronSyncingState', () => {
        const pair = { id: 'id ' } as CauldronEntity;

        it('should return true', () => {
            cauldronSyncUtilsService.setCauldronSyncingState(pair, true);
            const status = cauldronSyncUtilsService.isCauldronSyncing(pair);
            expect(status).toEqual(true);
        });
    });
});
