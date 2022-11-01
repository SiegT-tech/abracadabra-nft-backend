import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CollateralEntity } from '../../../common/db/collateral-entity/dao/collateral.entity';
import { CollateralWithPagination } from '../../../common/db/collateral-entity/interfaces/collateral-with-pagination.interface';
import { NftEntityService } from '../../../common/db/nft-entity/services/nft-entity.service';
import { OfferType } from '../../../common/db/offer-entity/types';
import { CauldronTransformService } from '../../cauldron/services/cauldron-transform.service';
import { NftAttributesTransformerService } from '../../nft/services/nft-attributes-transformer.service';

@Injectable()
export class CollateralTransformerService {
    constructor(
        @Inject(forwardRef(() => NftAttributesTransformerService))
        private readonly nftAttributesTransformerService: NftAttributesTransformerService,
        @Inject(forwardRef(() => CauldronTransformService))
        private readonly cauldronTransformService: CauldronTransformService,
        private readonly nftEntityService: NftEntityService,
    ) {}

    public async toCollateralWithPagination({ collaterals, pagination }: CollateralWithPagination) {
        return {
            collaterals: await Promise.all(collaterals.map(collateral => this.toCollateral(collateral))),
            pagination,
        };
    }

    public async toCollateral({ id, name, totalSupply, address, logo, idsStartFrom, nftAttributes, cauldrons, floorPrice, banner }: CollateralEntity) {
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
            images: undefined,
        };

        if (Array.isArray(nftAttributes) && nftAttributes.length > 0) {
            collateral.nftAttributes = this.nftAttributesTransformerService.toCollateralAttributesList(nftAttributes);
        }

        if (Array.isArray(cauldrons) && cauldrons.length > 0) {
            collateral.cauldrons = await Promise.all(cauldrons.map(cauldron => this.cauldronTransformService.toCauldron(cauldron)));
        }

        collateral.images = await this.nftEntityService.getNftImages(id);

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
