import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

import { GetAccountNftsLoanDto } from './dto/get-account-nfts-loan.dto';
import { GetAccountNftsOfferDto } from './dto/get-account-nfts-offer.dto';
import { GetAccountNftsDto } from './dto/get-account-nfts.dto';
import { GetNftDto } from './dto/get-nfts.dto';
import { NftFiltersDto } from './dto/nft-filters.dto';
import { NftEntityService } from './services/nft-entity.service';
import { NftHelpersService } from './services/nft-helpers.service';
import { NftTransformService } from './services/nft-transform-service';

import { CollateralService } from '../collateral/services/collateral.service';
import { NOT_FOUND_ERRORS } from '../exceptions/codes';
import { NotFoundException } from '../exceptions/exceptions';

@Injectable()
export class NftHandler {
    constructor(
        private readonly collateralService: CollateralService,
        private readonly nftHelpersService: NftHelpersService,
        private readonly nftTransformService: NftTransformService,
        private readonly nftEntityService: NftEntityService,
    ) {}

    public getNfts({ filters, pagination }: GetNftDto) {
        return this.nftEntityService.getNfts(filters, pagination).pipe(map(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getLatsNfts() {
        return this.nftEntityService.getLatsNfts().pipe(map(nfts => this.nftTransformService.toLatsNfts(nfts)));
    }

    public async getNft({ collateralId }: NftFiltersDto, nftId: string) {
        const collateral = await this.collateralService.readOneOrFaild({ id: collateralId });
        if (typeof Number(nftId) !== 'number' || Number(nftId) < 0 || Number(nftId) > collateral.totalSupply) {
            throw new NotFoundException(NOT_FOUND_ERRORS.NFT_NOT_FOUND);
        }
        return await this.nftHelpersService.getNftById(collateral, Number(nftId));
    }

    public getAccountNfts({ filters, pagination }: GetAccountNftsDto) {
        return this.nftEntityService.getAccountNfts(filters, pagination).pipe(map(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getAccountNftsLoan({ filters, pagination }: GetAccountNftsLoanDto) {
        return this.nftEntityService.getNftsLoan(filters, pagination).pipe(map(data => this.nftTransformService.toNftsWithPagination(data)));
    }

    public getAccountNftsOffer({ filters, pagination }: GetAccountNftsOfferDto) {
        return this.nftEntityService.getNftsOffer(filters, pagination).pipe(map(data => this.nftTransformService.toNftsWithPagination(data)));
    }
}
