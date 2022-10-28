import { isAddressesEqual } from './is-addresses-equal';

describe('isAddressesEqual', () => {
    const address1 = '0x9A5620779feF1928eF87c1111491212efC2C3cB8';
    const address2 = '0x63a1e3877b1662A9ad124f8611b06e3ffBC29Cba';

    it('should return true', () => {
        expect(isAddressesEqual(address1, address1)).toBeTruthy();
        expect(isAddressesEqual(address1, address1.toLocaleLowerCase())).toBeTruthy();
        expect(isAddressesEqual(address1.toLocaleLowerCase(), address1.toLocaleLowerCase())).toBeTruthy();
    });

    it('should return false', () => {
        expect(isAddressesEqual(address1, address2)).toBeFalsy();
    });
});
