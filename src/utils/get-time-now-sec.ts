import { BigNumber } from 'nestjs-ethers';

export const getTimeNowSec = (): number =>
    BigNumber.from(Date.now())
        .div(1000)
        .toNumber();
