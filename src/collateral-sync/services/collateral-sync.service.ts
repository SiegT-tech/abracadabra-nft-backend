import { Injectable } from '@nestjs/common';
import { Log, AddressZero } from 'nestjs-ethers';

import { BlockchainService } from '../../blockchain/blockchain.service';
import { CollateralEvents } from '../../blockchain/constants';
import { CauldronService } from '../../cauldron/services/cauldron.service';
import { CollateralEntity } from '../../collateral/dao/collateral.entity';
import { CollateralService } from '../../collateral/services/collateral.service';
import { NftEntityService } from '../../nft/services/nft-entity.service';
import { NftHelpersService } from '../../nft/services/nft-helpers.service';
import { OfferService } from '../../offer/services/offer.service';
import { isAddressInArray } from '../../utils';

@Injectable()
export class CollateralSyncService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly collateralService: CollateralService,
        private readonly nftHelpersService: NftHelpersService,
        private readonly nftEntityService: NftEntityService,
        private readonly cauldronService: CauldronService,
        private readonly offerService: OfferService,
    ) {}

    public async parseLogs(collateral: CollateralEntity, logs: Log[]): Promise<void> {
        const contract = this.blockchainService.getCollateral(collateral.network, collateral.address);
        const cauldrons = await this.cauldronService.read({ network: collateral.network });
        const cauldronAddresses = cauldrons.map(({ address }) => address);

        for (const log of logs) {
            const { name, args } = contract.interface.parseLog(log);

            if (name === CollateralEvents.Transfer) {
                const { from, to, tokenId } = args;

                const isMinted = from === AddressZero;
                if (isMinted && Number(tokenId) > collateral.totalSupply) {
                    await this.collateralService.updateOne({ id: collateral.id }, { totalSupply: Number(tokenId) });
                }

                const nft = await this.nftHelpersService.findOrCreateNft(collateral, Number(tokenId), to);
                await this.nftEntityService.updateOne({ id: nft.id }, { owner: to });

                if (!isAddressInArray(to, cauldronAddresses) && !isAddressInArray(from, cauldronAddresses)) {
                    await this.offerService.delete({ nft });
                }
            }
        }
    }
}
