import { getDomainSeparator } from './get-domain-separator';

import { Networks } from '../blockchain/constants';

describe('getDomainSeparator', () => {
    it('should return string', () => {
        const hash = getDomainSeparator(Networks.MAINNET, '0x3a341f5474aac54829a587cE6ab13C86af6B1E29');
        expect(typeof hash).toEqual('string');
    });
});
