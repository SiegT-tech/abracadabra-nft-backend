import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';

import { BlockchainExplorerApiService } from './blockchain-explorer-api.service';
import { BlockchainService } from './blockchain.service';
import { ethersModules } from './constants';

const PROVIDERS = [BlockchainService, BlockchainExplorerApiService];

@Global()
@Module({
    imports: [...ethersModules.map(config => EthersModule.forRoot(config)), HttpModule],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class BlockchainModule {}
