import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { BlockchainService } from './blockchain.service';

import { exporerUris, Networks } from '../constants';

@Injectable()
export class BlockchainExplorerApiService {
    constructor(private readonly httpService: HttpService, private readonly blockchainService: BlockchainService) {}

    public async getContractsCreationTxHash(network: Networks, addresses: string[]): Promise<string[]> {
        const quary = `?module=contract&action=getcontractcreation&contractaddresses=${addresses.join(',')}`;
        const url = `${exporerUris[network]}${quary}`;
        const { data } = await this.httpService.get(url).toPromise();
        const { result } = data;
        return result.map(({ txHash }) => txHash);
    }

    public async getContractsCreationBlockNumber(network: Networks, addresses: string[]): Promise<number[]> {
        const provider = this.blockchainService.getProvider(network);
        const txHashes = await this.getContractsCreationTxHash(network, addresses);
        const tsx = await Promise.all(txHashes.map(txHash => provider.getTransaction(txHash)));
        return tsx.map(({ blockNumber }) => blockNumber);
    }

    public async getContractCreationBlockNumber(network: Networks, address: string): Promise<number> {
        return (await this.getContractsCreationBlockNumber(network, [address]))[0];
    }
}
