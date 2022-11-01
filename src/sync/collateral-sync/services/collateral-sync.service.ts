import { Injectable } from '@nestjs/common';
import { Log, AddressZero } from 'nestjs-ethers';

import { CauldronEntityService } from '../../../common/db/cauldron-entity/services/cauldron-entity.service';
import { CollateralEntity } from '../../../common/db/collateral-entity/dao/collateral.entity';
import { CollateralEntityService } from '../../../common/db/collateral-entity/services/collateral-entity.service';
import { NftHelpersEntityService } from '../../../common/db/nft-entity/services/nft-entity-helpers.service';
import { NftEntityService } from '../../../common/db/nft-entity/services/nft-entity.service';
import { OfferEntityService } from '../../../common/db/offer-entity/services/offer-entity.service';
import { CollateralEvents } from '../../../common/modules/blockchain/constants';
import { BlockchainService } from '../../../common/modules/blockchain/services/blockchain.service';
import { isAddressInArray } from '../../../utils';

@Injectable()
export class CollateralSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly collateralEntityService: CollateralEntityService,
        private readonly nftHelpersEntityService: NftHelpersEntityService,
        private readonly nftEntityService: NftEntityService,
        private readonly cauldronEntityService: CauldronEntityService,
        private readonly offerEntityService: OfferEntityService,
    ) {}

    public async parseLogs(collateral: CollateralEntity, logs: Log[]): Promise<void> {
        const contract = this.blockchainService.getCollateral(collateral.network, collateral.address);
        const cauldrons = await this.cauldronEntityService.read({ network: collateral.network });
        const cauldronAddresses = cauldrons.map(({ address }) => address);

        for (const log of logs) {
            const { name, args } = contract.interface.parseLog(log);

            if (name === CollateralEvents.Transfer) {
                const { from, to, tokenId } = args;

                const isMinted = from === AddressZero;
                if (isMinted && Number(tokenId) > collateral.totalSupply) {
                    await this.collateralEntityService.updateOne({ id: collateral.id }, { totalSupply: Number(tokenId) });
                }

                const nft = await this.nftHelpersEntityService.findOrCreateNft(collateral, Number(tokenId), to);
                await this.nftEntityService.updateOne({ id: nft.id }, { owner: to });

                if (!isAddressInArray(to, cauldronAddresses) && !isAddressInArray(from, cauldronAddresses)) {
                    await this.offerEntityService.delete({ nft });
                }
            }
        }
    }
}
