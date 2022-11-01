import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { NftEntity } from '../../../common/db/nft-entity/dao/nft.entity';
import { NftWithPagination } from '../../../common/db/nft-entity/interfaces/nft-with-pagination.interface';
import { CollateralTransformerService } from '../../collateral/services/collateral-transformer.service';
import { LoanTransformerService } from '../../loan/services/loan-transformer.service';
import { OfferTransformerService } from '../../offer/services/offer-transformer.service';

import { NftAttributesTransformerService } from './nft-attributes-transformer.service';

@Injectable()
export class NftTransformService {
    constructor(
        private readonly loanTransformerService: LoanTransformerService,
        private readonly offerTransformerService: OfferTransformerService,
        @Inject(forwardRef(() => CollateralTransformerService))
        private readonly collateralTransformerService: CollateralTransformerService,
        private readonly nftAttributesTransformerService: NftAttributesTransformerService,
    ) {}

    public async toNft({ tokenId, loans, offers, owner, name, description, tokenUrl, image, collateral, attributes }: NftEntity) {
        const nft = {
            tokenId,
            loans: [],
            offers: [],
            owner,
            name,
            description,
            tokenUrl,
            image,
            collateral: undefined,
            attributes: [],
        };

        if (Array.isArray(offers) && offers.length > 0) {
            nft.offers = offers.map(offer => this.offerTransformerService.toOffer(offer));
        }

        if (Array.isArray(loans) && loans.length > 0) {
            nft.loans = loans.map(loan => this.loanTransformerService.toLoan(loan));
        }

        if (Array.isArray(attributes) && attributes.length > 0) {
            nft.attributes = attributes.map(attribute => this.nftAttributesTransformerService.toNftAttribute(attribute));
        }

        if (collateral) {
            nft.collateral = await this.collateralTransformerService.toCollateral(collateral);
        }

        return nft;
    }

    public async toNftsWithPagination({ nfts, pagination }: NftWithPagination) {
        return {
            pagination,
            nfts: await Promise.all(nfts.map(nft => this.toNft(nft))),
        };
    }

    public async toLatsNfts(nfts: NftEntity[]) {
        return { nfts: await Promise.all(nfts.map(nft => this.toNft(nft))) };
    }
}
