import { Injectable } from '@nestjs/common';
import { InjectEthersProvider, StaticJsonRpcProvider } from 'nestjs-ethers';

import {
    NFTPair,
    NFTPair__factory,
    BentoBox,
    BentoBox__factory,
    Token,
    Token__factory,
    Collateral,
    Collateral__factory,
    NFTPairWithOracle,
    NFTPairWithOracle__factory,
} from '../../../../typechain';

import { Networks } from '../constants';

@Injectable()
export class BlockchainService {
    constructor(
        @InjectEthersProvider('eth')
        private readonly ethProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('eth-ropsten')
        private readonly ethRopstenProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('matic')
        private readonly maticProvider: StaticJsonRpcProvider,
    ) {}

    public getProvider(network: Networks): StaticJsonRpcProvider {
        if (network === Networks.MAINNET) return this.ethProvider;
        if (network === Networks.ROPSTEN) return this.ethRopstenProvider;
        if (network === Networks.POLYGON) return this.maticProvider;

        throw new Error(`${network} provider not implemented`);
    }

    public getNftPair(network: Networks, address: string): NFTPair {
        const provider = this.getProvider(network);
        return NFTPair__factory.connect(address, provider);
    }

    public getNftPairWithOracle(network: Networks, address: string): NFTPairWithOracle {
        const provider = this.getProvider(network);
        return NFTPairWithOracle__factory.connect(address, provider);
    }

    public getBentobox(network: Networks, address: string): BentoBox {
        const provider = this.getProvider(network);
        return BentoBox__factory.connect(address, provider);
    }

    public async getContractLogs(network: Networks, address: string, from: number, to: number) {
        const provider = this.getProvider(network);
        return provider.getLogs({ address, fromBlock: from, toBlock: to });
    }

    public async getTimestamp(network: Networks, blockNumber: number): Promise<number> {
        const provider = this.getProvider(network);
        const block = await provider.getBlock(blockNumber);
        return block.timestamp;
    }

    public getToken(network: Networks, address: string): Token {
        const provider = this.getProvider(network);
        return Token__factory.connect(address, provider);
    }

    public getCollateral(network: Networks, address: string): Collateral {
        const provider = this.getProvider(network);
        return Collateral__factory.connect(address, provider);
    }
}
