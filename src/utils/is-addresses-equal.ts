import { validateAndParseAddress } from './validate-and-parse-address';

export const isAddressesEqual = (address1: string, address2: string): boolean => {
    const _address1 = validateAndParseAddress(address1);
    const _address2 = validateAndParseAddress(address2);
    return _address1 === _address2;
};
