import { Injectable } from '@nestjs/common';
import { from, map, mergeMap } from 'rxjs';

import { CollateralEntityService } from '../../common/db/collateral-entity/services/collateral-entity.service';
import { NftHelpersEntityService } from '../../common/db/nft-entity/services/nft-entity-helpers.service';
import { NftEntityService } from '../../common/db/nft-entity/services/nft-entity.service';
import { NOT_FOUND_ERRORS } from '../../common/modules/exceptions/codes';
import { NotFoundException } from '../../common/modules/exceptions/exceptions';

import { GetAccountNftsLoanDto } from './dto/get-account-nfts-loan.dto';
import { GetAccountNftsOfferDto } from './dto/get-account-nfts-offer.dto';
import { GetAccountNftsDto } from './dto/get-account-nfts.dto';
import { GetNftDto } from './dto/get-nfts.dto';
import { NftFiltersDto } from './dto/nft-filters.dto';
import { NftTransformService } from './services/nft-transform-service';

@Injectable()
export class NftHandler {
    constructor(
        private readonly collateralEntityService: CollateralEntityService,
        private readonly nftHelpersEntityService: NftHelpersEntityService,
        private readonly nftTransformService: NftTransformService,
        private readonly nftEntityService: NftEntityService,
    ) {}

    public getNfts({ filters, pagination }: GetNftDto) {
        return this.nftEntityService.getNfts(filters, pagination).pipe(mergeMap(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getLatsNfts() {
        return this.nftEntityService.getLatsNfts().pipe(mergeMap(nfts => this.nftTransformService.toLatsNfts(nfts)));
    }

    public async getNft({ collateralId }: NftFiltersDto, nftId: string) {
        return from(this.collateralEntityService.readOneOrFaild({ id: collateralId })).pipe(
            map(collateral => {
                if (typeof Number(nftId) !== 'number' || Number(nftId) < 0 || Number(nftId) > collateral.totalSupply) {
                    throw new NotFoundException(NOT_FOUND_ERRORS.NFT_NOT_FOUND);
                }
                return collateral;
            }),
            mergeMap(collateral => this.nftHelpersEntityService.findOrCreateNft(collateral, Number(nftId))),
            mergeMap(nft => this.nftTransformService.toNft(nft)),
        );
    }

    public getAccountNfts({ filters, pagination }: GetAccountNftsDto) {
        return this.nftEntityService.getAccountNfts(filters, pagination).pipe(mergeMap(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getAccountNftsLoan({ filters, pagination }: GetAccountNftsLoanDto) {
        return this.nftEntityService.getNftsLoan(filters, pagination).pipe(mergeMap(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getAccountNftsOffer({ filters, pagination }: GetAccountNftsOfferDto) {
        return this.nftEntityService.getNftsOffer(filters, pagination).pipe(mergeMap(data => this.nftTransformService.toNftsWithPagination(data)));
    }
}
