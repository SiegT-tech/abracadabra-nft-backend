import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';

import { ethersModules } from './constants';
import { BlockchainExplorerApiService } from './services/blockchain-explorer-api.service';
import { BlockchainExternalApisService } from './services/blockchain-external-apis.service';
import { BlockchainHelpersService } from './services/blockchain-helpers.service';
import { BlockchainService } from './services/blockchain.service';
import { BlockchainUtilsService } from './services/blockhain-utils.service';

const PROVIDERS = [BlockchainService, BlockchainExplorerApiService, BlockchainHelpersService];

@Global()
@Module({
    imports: [...ethersModules.map(config => EthersModule.forRoot(config)), HttpModule],
    providers: [...PROVIDERS, BlockchainExternalApisService, BlockchainUtilsService],
    exports: PROVIDERS,
})
export class BlockchainModule {}
