import { join } from 'path';

import { CronExpression } from '@nestjs/schedule';

const { env } = process;

// App
export const APP_PORT = parseInt(env.APP_PORT);
export const APP_VERSION = env.npm_package_version;
const { APP_MODE } = env;

export const isSyncMode = APP_MODE === 'sync';
export const isApiMode = APP_MODE === 'api';

// Logger
export const LOG_FOLDER_PATH = join(process.cwd(), '/logs');

// Blockchain
export const { ETH_RPC, ETH_ROPSTEN_RPC, POLYGON_RPC } = env;

export const LEND_SIGNATURE_HASH = '0x51bdf8c1d18fdb31c98b3fa9c0eafb21834eebc55f0e77bd59fa99bc434ddf92';
export const BORROW_SIGNATURE_HASH = '0x31609c8787e5709f4c4e0d7c6f3239ad028b96968335012bb862a64361421ef9';

export const LEND_ORACLE_SIGNATURE_HASH = '0x8a9babc0343382eb95f2afe42315b0aae02bf65f3402dea5279df2857e1d5e33';
export const BORROW_ORACLE_SIGNATURE_HASH = '0xfc330aba716d251faf66653e0e3573bae6b9a6dfd29fd30dede3c7cddb7f60fe';

export const SYNC_LOGS_STEP = 2000;

export const cronTimes = {
    bentobox: {
        sync: CronExpression.EVERY_5_SECONDS,
    },
    cauldron: {
        sync: CronExpression.EVERY_5_SECONDS,
    },
    collateral: {
        sync: CronExpression.EVERY_5_SECONDS,
        flowerPrice: CronExpression.EVERY_12_HOURS,
    },
};
