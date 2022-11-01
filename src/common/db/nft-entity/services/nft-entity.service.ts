import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { FindConditions, FindManyOptions, Repository, ILike, SelectQueryBuilder } from 'typeorm';

import { AccountNftFilterDto, AccountNftLoanFilterDto, CauldronFiltersDto, AccountNftOfferFilterDto } from '../../../../api/nft/dto/nft-filters.dto';
import { DEFAULT_ORDER, DEFAULT_ORDER_BY, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants';
import { OfferFilters } from '../../../dto/offer-filters.dto';
import { PaginationDto } from '../../../dto/pagination.dto';
import { OfferType } from '../../offer-entity/types';

import { NftEntity } from '../dao/nft.entity';
import { NftWithPagination } from '../interfaces/nft-with-pagination.interface';

@Injectable()
export class NftEntityService {
    constructor(
        @InjectRepository(NftEntity)
        private readonly nftEntityRepository: Repository<NftEntity>,
    ) {}

    public create(doc: Partial<NftEntity>): Promise<NftEntity> {
        const created = this.nftEntityRepository.create(doc);
        return this.nftEntityRepository.save(created);
    }

    public readOne(options?: FindConditions<NftEntity>): Promise<NftEntity> {
        return this.nftEntityRepository.findOne({
            where: options,
            relations: [
                'attributes',
                'collateral',
                'loans',
                'loans.cauldron',
                'offers',
                'offers.cauldron',
                'collateral.cauldrons',
                'collateral.nftAttributes',
                'collateral.cauldrons.asset',
            ],
        });
    }

    public read(options?: FindConditions<NftEntity>): Promise<NftEntity[]> {
        return this.nftEntityRepository.find({
            where: options,
            relations: [
                'attributes',
                'collateral',
                'loans',
                'loans.cauldron',
                'offers',
                'offers.cauldron',
                'collateral.cauldrons',
                'collateral.nftAttributes',
                'collateral.cauldrons.asset',
            ],
        });
    }

    public updateOne(where: Partial<NftEntity>, doc: Partial<NftEntity>) {
        return this.nftEntityRepository.update(where, doc);
    }

    public getLatsNfts(): Observable<NftEntity[]> {
        const qb = this.getNftQueryBuilder();
        qb.andWhere('offers.type = :type', { type: OfferType.BORROW });
        qb.orderBy('offers.createdAt', 'DESC');
        qb.take(20);
        qb.leftJoinAndSelect('nft.offers', '_offers');
        return from(qb.getMany());
    }

    public getNfts(filters: CauldronFiltersDto, pagination: PaginationDto = {}): Observable<NftWithPagination> {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER } = pagination;
        const { cauldronIds, network, ...offerFilters } = filters;

        const qb = this.getNftQueryBuilder().andWhere('offers.type = :type', { type: OfferType.BORROW });

        if (network) {
            qb.andWhere('nft_collateral.network = :network', { network });
        }

        if (Array.isArray(cauldronIds) && cauldronIds.length > 0) {
            qb.andWhere('nft_collateral_cauldrons.id IN (:...cauldronIds)', { cauldronIds });
        }

        this.addedFilters(qb, offerFilters);

        const quaryGetMany = qb
            .leftJoinAndSelect('nft.offers', '_offers')
            .skip(pageSize * pageNumber)
            .take(pageSize)
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([nfts, total]) => ({
                nfts,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getAccountNfts(filters: AccountNftFilterDto, pagination: PaginationDto = {}): Observable<NftWithPagination> {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER, orderBy = DEFAULT_ORDER_BY, order = DEFAULT_ORDER } = pagination;
        const { account } = filters;

        const query: FindConditions<NftEntity> = { owner: ILike(`%${account}%`) };

        const condition: FindManyOptions<NftEntity> = {
            where: query,
            skip: pageSize * pageNumber,
            take: pageSize,
            order: { [orderBy]: order },
            relations: [
                'attributes',
                'collateral',
                'loans',
                'loans.cauldron',
                'offers',
                'offers.cauldron',
                'collateral.cauldrons',
                'collateral.nftAttributes',
                'collateral.cauldrons.asset',
            ],
        };

        return from(this.nftEntityRepository.findAndCount(condition)).pipe(
            map(([nfts, total]) => ({
                nfts,
                pagination: { pageSize, pageNumber, orderBy, order, total },
            })),
        );
    }

    public getNftsLoan(filters: AccountNftLoanFilterDto, pagination: PaginationDto = {}) {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER } = pagination;
        const { borrower, lender, network, cauldronIds, ...offerFilters } = filters;

        const qb = this.getNftQueryBuilder();

        if (borrower) {
            qb.andWhere('loans.borrower ILIKE :borrower', { borrower: `%${borrower}%` });
        }

        if (lender) {
            qb.andWhere('loans.lender ILIKE :lender', { lender: `%${lender}%` });
        }

        if (network) {
            qb.andWhere('nft_collateral.network = :network', { network });
        }

        if (Array.isArray(cauldronIds) && cauldronIds.length > 0) {
            qb.andWhere('nft_collateral_cauldrons.id IN (:...cauldronIds)', { cauldronIds });
        }

        this.addedFilters(qb, offerFilters);

        const quaryGetMany = qb
            .skip(pageSize * pageNumber)
            .take(pageSize)
            .orderBy('loans.createdAt', 'DESC')
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([nfts, total]) => ({
                nfts,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getNftsOffer(filters: AccountNftOfferFilterDto, pagination: PaginationDto = {}) {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER } = pagination;
        const { network, account, type, ...offerFilters } = filters;

        const qb = this.getNftQueryBuilder();

        if (account) {
            qb.andWhere('offers.address ILIKE :account', { account: `%${account}%` });
        }

        if (network) {
            qb.andWhere('nft_collateral.network = :network', { network });
        }

        if (type) {
            qb.andWhere('offers.type = :type', { type });
        }

        this.addedFilters(qb, offerFilters);

        const quaryGetMany = qb
            .skip(pageSize * pageNumber)
            .take(pageSize)
            .orderBy('offers.createdAt', 'DESC')
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([nfts, total]) => ({
                nfts,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getNftImages(collateralId: string, size = 20): Promise<string[]> {
        const qb = this.nftEntityRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.collateral', 'nft_collateral')
            .where('nft_collateral.id = :collateralId', { collateralId })
            .andWhere('nft.image IS NOT NULL')
            .take(size);

        return qb.getMany().then(nfts => nfts.map(({ image }) => image));
    }

    private addedFilters(qb: SelectQueryBuilder<NftEntity>, { valuation, duration, annualInterestBPS, ltvBPS, collateralIds, assetId }: OfferFilters) {
        if (valuation && (Number.isInteger(valuation.from) || Number.isInteger(valuation.to))) {
            if (Number.isInteger(valuation.from) && !Number.isInteger(valuation.to)) {
                qb.andWhere('offers.valuation >= :from', { from: valuation.from });
            }

            if (Number.isInteger(valuation.to) && !Number.isInteger(valuation.from)) {
                qb.andWhere('offers.valuation <= :to', { to: valuation.to });
            }

            if (Number.isInteger(valuation.from) && Number.isInteger(valuation.to)) {
                qb.andWhere('offers.valuation >= :from and offers.valuation <= :to', { from: valuation.from, to: valuation.to });
            }
        }

        if (duration && (Number.isInteger(duration.from) || Number.isInteger(duration.to))) {
            if (Number.isInteger(duration.from) && !Number.isInteger(duration.to)) {
                qb.andWhere('offers.duration >= :from', { from: duration.from });
            }

            if (Number.isInteger(duration.to) && !Number.isInteger(duration.from)) {
                qb.andWhere('offers.duration <= :to', { to: duration.to });
            }

            if (Number.isInteger(duration.from) && Number.isInteger(duration.to)) {
                qb.andWhere('offers.duration >= :from and offers.duration <= :to', { from: duration.from, to: duration.to });
            }
        }

        if (annualInterestBPS && (Number.isInteger(annualInterestBPS.from) || Number.isInteger(annualInterestBPS.to))) {
            if (Number.isInteger(annualInterestBPS.from) && !Number.isInteger(annualInterestBPS.to)) {
                qb.andWhere('offers.annualInterestBPS >= :from', { from: annualInterestBPS.from });
            }

            if (Number.isInteger(annualInterestBPS.to) && !Number.isInteger(annualInterestBPS.from)) {
                qb.andWhere('offers.annualInterestBPS <= :to', { to: annualInterestBPS.to });
            }

            if (Number.isInteger(annualInterestBPS.from) && Number.isInteger(annualInterestBPS.to)) {
                qb.andWhere('offers.annualInterestBPS >= :from and offers.annualInterestBPS <= :to', { from: annualInterestBPS.from, to: annualInterestBPS.to });
            }
        }

        if (ltvBPS && (Number.isInteger(ltvBPS.from) || Number.isInteger(ltvBPS.to))) {
            if (Number.isInteger(ltvBPS.from) && !Number.isInteger(ltvBPS.to)) {
                qb.andWhere('offers.ltvBPS >= :from', { from: ltvBPS.from });
            }

            if (Number.isInteger(ltvBPS.to) && !Number.isInteger(ltvBPS.from)) {
                qb.andWhere('offers.ltvBPS <= :to', { to: ltvBPS.to });
            }

            if (Number.isInteger(ltvBPS.from) && Number.isInteger(ltvBPS.to)) {
                qb.andWhere('offers.ltvBPS >= :from and offers.ltvBPS <= :to', { from: ltvBPS.from, to: ltvBPS.to });
            }
        }

        if (Array.isArray(collateralIds) && collateralIds.length > 0) {
            qb.andWhere('nft_collateral.id IN (:...collateralIds)', { collateralIds });
        }

        if (assetId) {
            qb.andWhere('nft_collateral_cauldrons_asset.id = :assetId', { assetId });
        }

        return qb;
    }

    private getNftQueryBuilder(): SelectQueryBuilder<NftEntity> {
        return this.nftEntityRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.loans', 'loans')
            .leftJoinAndSelect('nft.attributes', 'attributes')
            .leftJoinAndSelect('loans.cauldron', 'loans_cauldron')
            .leftJoinAndSelect('nft.offers', 'offers')
            .leftJoinAndSelect('offers.cauldron', 'offers_cauldron')
            .leftJoinAndSelect('nft.collateral', 'nft_collateral')
            .leftJoinAndSelect('nft_collateral.cauldrons', 'nft_collateral_cauldrons')
            .leftJoinAndSelect('nft_collateral.nftAttributes', 'nft_collateral_nftAttributes')
            .leftJoinAndSelect('nft_collateral_cauldrons.asset', 'nft_collateral_cauldrons_asset')
            .where('nft_collateral_cauldrons.checked = true');
    }
}
