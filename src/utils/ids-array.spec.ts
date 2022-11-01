import { idsArray } from './ids-array';

describe('idsArray', () => {
    it('should return number array', () => {
        const array = idsArray(10, 1);
        expect(Array.isArray(array)).toBeTruthy();
        expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});
