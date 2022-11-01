import { Networks } from 'common/modules/blockchain/constants';

export interface IAsset {
    name: string;
    decimals: number;
    address: string;
    network: Networks;
}
