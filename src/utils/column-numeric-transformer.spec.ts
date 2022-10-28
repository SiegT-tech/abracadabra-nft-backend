import { ColumnNumericTransformer } from './column-numeric-transformer';

describe('ColumnNumericTransformer', () => {
    let transformer: ColumnNumericTransformer;

    beforeEach(() => {
        transformer = new ColumnNumericTransformer();
    });

    it('should return number (to)', () => {
        const to = transformer.to(10);
        expect(to).toEqual(10);
    });

    it('should return number (from)', () => {
        const to = transformer.from('10.1');
        expect(to).toEqual(10.1);
    });
});
