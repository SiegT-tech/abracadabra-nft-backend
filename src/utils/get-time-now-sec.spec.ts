import { getTimeNowSec } from './get-time-now-sec';

describe('getTimeNowSec', () => {
    it('should return number', () => {
        const now = getTimeNowSec();
        expect(typeof now).toEqual('number');
    });
});
