import { Injectable } from '@nestjs/common';
import { Log } from 'nestjs-ethers';

import { AssetEntityHelpersService } from '../../../common/db/asset-entity/services/asset-entity-helpers.service';
import { BentoboxEntity } from '../../../common/db/bentobox-entity/dao/bentobox.entity';
import { CauldronEntityService } from '../../../common/db/cauldron-entity/services/cauldron-entity.service';
import { CollateralEntityHelpersService } from '../../../common/db/collateral-entity/services/collateral-entity-helpers.service';
import { BentoboxEvents, masterContracts } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { isAddressInArray } from '../../../utils';

@Injectable()
export class BentoboxSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly cauldronEntityService: CauldronEntityService,
        private readonly assetEntityHelpersService: AssetEntityHelpersService,
        private readonly collateralEntityHelpersService: CollateralEntityHelpersService,
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
                    const asset = await this.assetEntityHelpersService.findOrCreateAsset(bentobox.network, assetAddress);
                    const collateral = await this.collateralEntityHelpersService.findOrCreateCollateral(bentobox.network, collateralAddress);
                    await this.cauldronEntityService.create({
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
