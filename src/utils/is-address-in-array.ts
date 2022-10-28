import { isAddressesEqual } from './is-addresses-equal';

export const isAddressInArray = (address: string, addresses: string[]): boolean => {
    const filtred = addresses.filter(target => isAddressesEqual(address, target));
    return filtred.length > 0;
};
