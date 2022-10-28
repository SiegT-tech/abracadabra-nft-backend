import { Networks } from '../../blockchain/constants';

export interface IAsset {
    name: string;
    decimals: number;
    address: string;
    network: Networks;
}
