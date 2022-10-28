import { Injectable } from '@nestjs/common';
import { Log } from 'nestjs-ethers';

import { AssetHelpersService } from '../../asset/services/asset-helpers.service';
import { BentoboxEntity } from '../../bentobox/dao/bentobox.entity';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { BentoboxEvents, masterContracts } from '../../blockchain/constants';
import { CauldronService } from '../../cauldron/services/cauldron.service';
import { CollateralHelpersService } from '../../collateral/services/collateral-helpers.service';
import { isAddressInArray } from '../../utils';

@Injectable()
export class BentoboxSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly cauldronService: CauldronService,
        private readonly assetHelpersService: AssetHelpersService,
        private readonly collateralHelpersService: CollateralHelpersService,
    ) {}

    public async parseLogs(bentobox: BentoboxEntity, logs: Log[]): Promise<void> {
        const bentoboxContract = this.blockchainService.getBentobox(bentobox.network, bentobox.address);
        for (const log of logs) {
            const { blockNumber } = log;
            const { name, args } = bentoboxContract.interface.parseLog(log);

            if (name === BentoboxEvents.LogDeploy) {
                const { masterContract, cloneAddress } = args;
                if (isAddressInArray(masterContract, masterContracts[bentobox.network])) {
                    const pair = this.blockchainService.getNftPair(bentobox.network, cloneAddress);
                    const assetAddress = await pair.asset();
                    const collateralAddress = await pair.collateral();
                    const asset = await this.assetHelpersService.findOrCreateAsset(bentobox.network, assetAddress);
                    const collateral = await this.collateralHelpersService.findOrCreateCollateral(bentobox.network, collateralAddress);
                    await this.cauldronService.create({
                        bentobox,
                        address: cloneAddress,
                        creationBlock: blockNumber,
                        network: bentobox.network,
                        masterContract,
                        asset,
                        collateral,
                        canSync: false,
                        deprecated: false,
                        checked: false,
                        oracle: false,
                    });
                }
            }
        }
    }
}
