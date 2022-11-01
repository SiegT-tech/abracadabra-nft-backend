import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';

import { OfferEntity } from '../dao/offer.entity';
import { OfferType } from '../types';

@Injectable()
export class OfferEntityService {
    constructor(
        @InjectRepository(OfferEntity)
        private readonly offerEntityRepository: Repository<OfferEntity>,
    ) {}

    public create(doc: Partial<OfferEntity>): Promise<OfferEntity> {
        const created = this.offerEntityRepository.create(doc);
        return this.offerEntityRepository.save(created);
    }

    public delete(options: FindConditions<OfferEntity>) {
        return this.offerEntityRepository.softDelete(options);
    }

    public restore(options: FindConditions<OfferEntity>){
        return this.offerEntityRepository.restore(options);
    }

    public read(options?: FindConditions<OfferEntity>): Promise<OfferEntity[]> {
        return this.offerEntityRepository.find({ where: options, relations: ['nft', 'cauldron', 'cauldron.collateral'] });
    }

    public updateOne(where: Partial<OfferEntity>, doc: Partial<OfferEntity>) {
        return this.offerEntityRepository.update(where, doc);
    }

    public async checkIfExist(collateralId: string, nftId: number, type: OfferType, address: string): Promise<boolean> {
        const qb = await this.getOfferQueryBuilder()
            .where('collateral.id = :collateralId', { collateralId })
            .andWhere('nft.tokenId = :nftId', { nftId })
            .andWhere('offer.type = :type', { type })
            .where('offer.address ILIKE :address', { address: `%${address}%` })
            .getCount();

        return qb !== 0;
    }

    private getOfferQueryBuilder() {
        return this.offerEntityRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.cauldron', 'cauldron')
            .leftJoinAndSelect('cauldron.collateral', 'collateral')
            .leftJoinAndSelect('offer.nft', 'nft');
    }
}
