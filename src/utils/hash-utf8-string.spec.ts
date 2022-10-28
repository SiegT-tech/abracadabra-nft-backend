import { hashUtf8String } from './hash-utf8-string';

describe('hashUtf8String', () => {
    it('should return string', () => {
        const string = 'address';
        const hash = hashUtf8String(string);
        expect(typeof hash).toEqual('string');
    });
});
