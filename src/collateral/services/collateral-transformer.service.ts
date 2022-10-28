import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CauldronTransformService } from '../../cauldron/services/cauldron-transform.service';
import { NftAttributesTransformerService } from '../../nft/services/nft-attributes-transformer.service';
import { OfferType } from '../../offer/dao/offer.entity';

import { CollateralEntity } from '../dao/collateral.entity';
import { CollateralWithPagination } from '../interfaces/collateral-with-pagination.interface';

@Injectable()
export class CollateralTransformerService {
    constructor(
        @Inject(forwardRef(() => NftAttributesTransformerService))
        private readonly nftAttributesTransformerService: NftAttributesTransformerService,
        @Inject(forwardRef(() => CauldronTransformService))
        private readonly cauldronTransformService: CauldronTransformService,
    ) {}

    public toCollateralWithPagination({ collaterals, pagination }: CollateralWithPagination) {
        return {
            collaterals: collaterals.map(collateral => this.toCollateral(collateral)),
            pagination,
        };
    }

    public toCollateral({ id, name, totalSupply, address, logo, idsStartFrom, nftAttributes, cauldrons, floorPrice, banner }: CollateralEntity) {
        const collateral = {
            id,
            name,
            address,
            totalSupply,
            logo,
            idsStartFrom,
            nftAttributes: undefined,
            cauldrons: undefined,
            floorPrice,
            banner,
        };

        if (Array.isArray(nftAttributes) && nftAttributes.length > 0) {
            collateral.nftAttributes = this.nftAttributesTransformerService.toCollateralAttributesList(nftAttributes);
        }

        if (Array.isArray(cauldrons) && cauldrons.length > 0) {
            collateral.cauldrons = cauldrons.map(cauldron => this.cauldronTransformService.toCauldron(cauldron));
        }

        return collateral;
    }

    public toCollateralList(collateral: CollateralEntity) {
        const nftOffers = collateral.nfts.filter(nft => nft.offers.map(offer => offer.type).includes(OfferType.BORROW));

        return {
            id: collateral.id,
            name: collateral.name,
            count: nftOffers.length,
        };
    }
}
