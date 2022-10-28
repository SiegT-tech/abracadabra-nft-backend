import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';

import { NftAttributesEntity } from '../dao/nft-attributes.entity';

@Injectable()
export class NftAttributesEntityService {
    constructor(
        @InjectRepository(NftAttributesEntity)
        private readonly nftAttributesEntityRepository: Repository<NftAttributesEntity>,
    ) {}

    public create(doc: Partial<NftAttributesEntity>): Promise<NftAttributesEntity> {
        const created = this.nftAttributesEntityRepository.create(doc);
        return this.nftAttributesEntityRepository.save(created);
    }

    public readOne(options?: FindConditions<NftAttributesEntity>): Promise<NftAttributesEntity> {
        return this.nftAttributesEntityRepository.findOne(options);
    }

    public read(options?: FindConditions<NftAttributesEntity>): Promise<NftAttributesEntity[]> {
        return this.nftAttributesEntityRepository.find(options);
    }

    public updateOne(where: Partial<NftAttributesEntity>, doc: Partial<NftAttributesEntity>) {
        return this.nftAttributesEntityRepository.update(where, doc);
    }
}
