import { Test } from '@nestjs/testing';

import { CollateralSyncUtilsService } from './collateral-sync-utils.service';

describe('CollateralSyncUtilsService', () => {
    let collateralSyncUtilsService: CollateralSyncUtilsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralSyncUtilsService],
        }).compile();

        collateralSyncUtilsService = moduleRef.get(CollateralSyncUtilsService);
    });

    describe('isCollateralSyncing', () => {
        it('shoild return false', () => {
            const status = collateralSyncUtilsService.isCollateralSyncing({ id: 'id' } as any);
            expect(status).toBeFalsy();
        });
    });

    describe('setCollateralSyncingState', () => {
        it('shoild return coid', () => {
            const status = collateralSyncUtilsService.setCollateralSyncingState({ id: 'id' } as any, false);
            expect(status).toBeUndefined();
        });
    });
});
