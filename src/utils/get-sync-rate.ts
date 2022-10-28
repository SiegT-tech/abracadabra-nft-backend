import { SYNC_LOGS_STEP } from '../env';

interface GetSyncRateResult {
    fromBlock: number;
    toBlock: number;
    canSync: boolean;
}

export const getSyncRate = (lastSyncBlock: number, currentChainBlock: number): GetSyncRateResult => {
    const rate: GetSyncRateResult = {
        fromBlock: lastSyncBlock + 1,
        toBlock: lastSyncBlock + SYNC_LOGS_STEP,
        canSync: true,
    };

    if (rate.fromBlock > currentChainBlock) {
        rate.canSync = false;
    }

    if (rate.toBlock > currentChainBlock) {
        rate.toBlock = currentChainBlock;
    }

    return rate;
};
