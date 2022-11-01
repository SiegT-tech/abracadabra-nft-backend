import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';

import { DEFAULT_ORDER, DEFAULT_ORDER_BY, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants';
import { FiltersDto } from '../../../dto/filters.dto';
import { PaginationDto } from '../../../dto/pagination.dto';
import { NOT_FOUND_ERRORS } from '../../../modules/exceptions/codes';
import { NotFoundException } from '../../../modules/exceptions/exceptions';

import { CauldronEntity } from '../dao/cauldron.entity';
import { CauldronWithPagination } from '../interfaces/cauldron-with-pagination.interface';

@Injectable()
export class CauldronEntityService {
    constructor(
        @InjectRepository(CauldronEntity)
        private readonly cauldronEntityRepository: Repository<CauldronEntity>,
    ) {}

    public create(doc: Partial<CauldronEntity>): Promise<CauldronEntity> {
        const created = this.cauldronEntityRepository.create(doc);
        return this.cauldronEntityRepository.save(created);
    }

    public updateOne(where: Partial<CauldronEntity>, doc: Partial<CauldronEntity>) {
        return this.cauldronEntityRepository.update(where, doc);
    }

    public read(options?: FindConditions<CauldronEntity>): Promise<CauldronEntity[]> {
        return this.cauldronEntityRepository.find({ where: options, relations: ['bentobox', 'collateral', 'asset', 'collateral.nftAttributes'] });
    }

    public readOne(options?: FindConditions<CauldronEntity>): Promise<CauldronEntity> {
        return this.cauldronEntityRepository.findOne({ where: options, relations: ['bentobox', 'collateral', 'asset', 'collateral.nftAttributes'] });
    }

    public async readOneOrFaild(options?: FindConditions<CauldronEntity>): Promise<CauldronEntity> {
        const pair = await this.readOne(options);

        if (!pair) {
            throw new NotFoundException(NOT_FOUND_ERRORS.CAULDRON_NOT_FOUND);
        }

        return pair;
    }

    public getPairs(filters: FiltersDto = {}, pagination: PaginationDto = {}): Observable<CauldronWithPagination> {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER, orderBy = DEFAULT_ORDER_BY, order = DEFAULT_ORDER } = pagination;
        const { network } = filters;

        const query: FindConditions<CauldronEntity> = { checked: true };

        if (network) {
            Object.assign(query, { network });
        }

        const condition: FindManyOptions<CauldronEntity> = {
            where: query,
            skip: pageSize * pageNumber,
            take: pageSize,
            order: { [orderBy]: order },
            relations: ['collateral', 'asset', 'collateral.nftAttributes'],
        };

        return from(this.cauldronEntityRepository.findAndCount(condition)).pipe(
            map(([cauldrons, total]) => ({
                cauldrons,
                pagination: { pageSize, pageNumber, orderBy, order, total },
            })),
        );
    }
}
