import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { FindConditions, Repository, SelectQueryBuilder } from 'typeorm';

import { GetCollateralsFilterDto } from '../../../../api/collateral/dto/get-collaterals-filter.dto';
import { DEFAULT_ORDER, DEFAULT_ORDER_BY, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants';
import { PaginationDto } from '../../../dto/pagination.dto';
import { NOT_FOUND_ERRORS } from '../../../modules/exceptions/codes';
import { NotFoundException } from '../../../modules/exceptions/exceptions';

import { CollateralEntity } from '../dao/collateral.entity';
import { CollateralWithPagination } from '../interfaces/collateral-with-pagination.interface';

@Injectable()
export class CollateralEntityService {
    constructor(
        @InjectRepository(CollateralEntity)
        private readonly collateralEntityRepository: Repository<CollateralEntity>,
    ) {}

    public create(doc: Partial<CollateralEntity>): Promise<CollateralEntity> {
        const created = this.collateralEntityRepository.create(doc);
        return this.collateralEntityRepository.save(created);
    }

    public readOne(options?: FindConditions<CollateralEntity>): Promise<CollateralEntity> {
        const qb = this.getCollateralQueryBuilder();
        
        for(const key of Object.keys(options)){
            qb.andWhere(`collateral.${key} = :${key}`, { [key] : options[key]});
        }

        return qb.getOne();
    }

    public read(options?: FindConditions<CollateralEntity>): Promise<CollateralEntity[]> {
        const qb = this.getCollateralQueryBuilder();
        
        for(const key of Object.keys(options)){
            qb.andWhere(`collateral.${key} = :${key}`, { [key] : options[key]});
        }

        return qb.getMany();
    }

    public updateOne(where: Partial<CollateralEntity>, doc: Partial<CollateralEntity>) {
        return this.collateralEntityRepository.update(where, doc);
    }

    public getCollaterals(filters: GetCollateralsFilterDto = {}, pagination: PaginationDto = {}): Observable<CollateralWithPagination> {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER, orderBy = DEFAULT_ORDER_BY, order = DEFAULT_ORDER } = pagination;
        const { network, search } = filters;

        const qb = this.getCollateralQueryBuilder();

        if (network) {
            qb.andWhere('collateral.network = :network', { network });
        }

        if (search) {
            qb.andWhere(`fts @@ plainto_tsquery('${search}:*')`);
        }

        const quaryGetMany = qb
            .skip(pageSize * pageNumber)
            .take(pageSize)
            .orderBy(`collateral.${orderBy}`, order)
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([collaterals, total]) => ({
                collaterals,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getCollateralList() {
        const qb = this.getCollateralQueryBuilder()
            .leftJoinAndSelect('collateral.nfts', 'nfts')
            .leftJoinAndSelect('nfts.offers', 'offers');

        return from(qb.getMany());
    }

    private getCollateralQueryBuilder(): SelectQueryBuilder<CollateralEntity> {
        return this.collateralEntityRepository
            .createQueryBuilder('collateral')
            .leftJoinAndSelect('collateral.cauldrons', 'cauldrons')
            .leftJoinAndSelect('collateral.nftAttributes', 'nftAttributes')
            .where('cauldrons.checked = true');
    }

    public async readOneOrFaild(options?: FindConditions<CollateralEntity>): Promise<CollateralEntity> {
        const collateral = await this.readOne(options);

        if (!collateral) {
            throw new NotFoundException(NOT_FOUND_ERRORS.COLLATERAL_NOT_FOUND);
        }

        return collateral;
    }
}
