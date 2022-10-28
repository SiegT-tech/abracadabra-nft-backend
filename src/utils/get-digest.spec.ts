import { getDigest } from './get-digest';

describe('getDigest', () => {
    const domainSeporator = '0x1e61fd020c43dcb54727b956af36ab9840b1271be7ac6d095a1798fb74645acb';
    const dataHash = '0xf076a1ab2f445c98788f8ec2942b73122996c63c9732e07361b760a578584b44';

    it('should return string', () => {
        const digest = getDigest(domainSeporator, dataHash);
        expect(typeof digest).toEqual('string');
    });

    it('should return hash', () => {
        const digest = getDigest(domainSeporator, dataHash);
        expect(digest).toEqual('0x3059f74153413ba57f11d5abaecc1312fda5f340265d3d6db89d8dd5c877ab84');
    });
});
