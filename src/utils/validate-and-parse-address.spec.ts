import { validateAndParseAddress } from './validate-and-parse-address';

const addressMock = '0xa1BE64Bb138f2B6BCC2fBeCb14c3901b63943d0E';

describe('validateAndParseAddress', () => {
    it('should return address', () => {
        const validatedAddress = validateAndParseAddress(addressMock);
        expect(validatedAddress).toEqual(addressMock);
    });

    it('should return valid address', () => {
        const validatedAddress = validateAndParseAddress(addressMock.toLocaleLowerCase());
        expect(validatedAddress).toEqual(addressMock);
    });

    it('should return error', () => {
        const validateAddress = () => validateAndParseAddress('address');
        expect(validateAddress).toThrowError();
    });
});
