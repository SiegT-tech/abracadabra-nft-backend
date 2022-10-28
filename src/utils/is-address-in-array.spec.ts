import { isAddressInArray } from './is-address-in-array';
import * as utils from './is-addresses-equal';

describe('isAddressInArray', () => {
    describe('return true', () => {
        let isAddressInArrayMock: jest.SpyInstance;

        const addressMock = '0x9A5620779feF1928eF87c1111491212efC2C3cB8';
        const addressArrayMock = [addressMock];

        beforeEach(() => {
            isAddressInArrayMock = jest.spyOn(utils, 'isAddressesEqual').mockReturnValueOnce(true);
        });

        it('should return true', () => {
            const status = isAddressInArray(addressMock, addressArrayMock);
            expect(status).toBeTruthy();
        });

        it('should call isAddressesEqual', () => {
            isAddressInArray(addressMock, addressArrayMock);
            expect(isAddressInArrayMock).toHaveBeenCalledTimes(1);
            expect(isAddressInArrayMock).toHaveBeenCalledWith(addressMock, addressMock);
        });
    });

    describe('return false', () => {
        let isAddressInArrayMock: jest.SpyInstance;

        const addressMock = '0x9A5620779feF1928eF87c1111491212efC2C3cB8';
        const addressArrayMock = ['0x63a1e3877b1662A9ad124f8611b06e3ffBC29Cba'];

        beforeEach(() => {
            isAddressInArrayMock = jest.spyOn(utils, 'isAddressesEqual').mockReturnValueOnce(false);
        });

        it('should return true', () => {
            const status = isAddressInArray(addressMock, addressArrayMock);
            expect(status).toBeFalsy();
        });

        it('should call isAddressesEqual', () => {
            isAddressInArray(addressMock, addressArrayMock);
            expect(isAddressInArrayMock).toHaveBeenCalledTimes(1);
            expect(isAddressInArrayMock).toHaveBeenCalledWith(addressMock, addressArrayMock[0]);
        });
    });
});
