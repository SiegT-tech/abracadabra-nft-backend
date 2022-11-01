import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';

import { DEFAULT_ORDER, DEFAULT_ORDER_BY, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants';
import { FiltersDto } from '../../../dto/filters.dto';
import { PaginationDto } from '../../../dto/pagination.dto';

import { AssetEntity } from '../dao/asset.entity';
import { AssetWithPagination } from '../interfaces/asset-with-pagination.interface';

@Injectable()
export class AssetEntityService {
    constructor(
        @InjectRepository(AssetEntity)
        private readonly assetEntityRepository: Repository<AssetEntity>,
    ) {}

    public create(doc: Partial<AssetEntity>): Promise<AssetEntity> {
        const created = this.assetEntityRepository.create(doc);
        return this.assetEntityRepository.save(created);
    }

    public read(options?: FindConditions<AssetEntity>): Promise<AssetEntity> {
        return this.assetEntityRepository.findOne(options);
    }

    public getAssets(filters: FiltersDto = {}, pagination: PaginationDto = {}): Observable<AssetWithPagination> {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER, orderBy = DEFAULT_ORDER_BY, order = DEFAULT_ORDER } = pagination;
        const { network } = filters;

        const query: FindConditions<AssetEntity> = {};

        if (network) {
            Object.assign(query, { network });
        }

        const condition: FindManyOptions<AssetEntity> = {
            where: query,
            skip: pageSize * pageNumber,
            take: pageSize,
            order: { [orderBy]: order },
        };

        return from(this.assetEntityRepository.findAndCount(condition)).pipe(
            map(([assets, total]) => ({
                assets,
                pagination: { pageSize, pageNumber, orderBy, order, total },
            })),
        );
    }
}
