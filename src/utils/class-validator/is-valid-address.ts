import { isAddress } from 'nestjs-ethers';

import { ValidatorType, wrapValidator } from './validator.wrapper';

export function IsValidAddress(): ValidatorType {
    return wrapValidator('isValidAddress', value => isAddress(value), { message: () => 'Invalid address' });
}
