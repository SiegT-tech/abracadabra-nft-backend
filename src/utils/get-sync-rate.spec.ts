import { getSyncRate } from './get-sync-rate';

import { SYNC_LOGS_STEP } from '../env';

describe('getSyncRate', () => {
    it('should return rate', () => {
        const { fromBlock, toBlock, canSync } = getSyncRate(0, SYNC_LOGS_STEP);
        expect(fromBlock).toEqual(1);
        expect(toBlock).toEqual(SYNC_LOGS_STEP);
        expect(canSync).toEqual(true);
    });

    it('should return canSync false', () => {
        const { canSync } = getSyncRate(10, 9);
        expect(canSync).toBeFalsy();
    });

    it('should return rate (toBlock)', () => {
        const { toBlock } = getSyncRate(0, SYNC_LOGS_STEP * 3);
        expect(toBlock).toEqual(SYNC_LOGS_STEP);
    });
});
