import { tokenUrlToHttp } from './token-url-to-http';

describe('tokenUrlToHttp', () => {
    it('should retrun uri (http)', () => {
        const uri = 'http://test.com';
        expect(tokenUrlToHttp(uri)).toEqual(uri);
    });

    it('should retrun uri (ipfs)', () => {
        const uri = 'ipfs//test';
        expect(tokenUrlToHttp(uri)).toEqual('https://ipfs.io/ipfs/test');
    });
});
