import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';

import { OfferEntity, OfferType } from '../dao/offer.entity';

@Injectable()
export class OfferService {
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

    public read(options?: FindConditions<OfferEntity>): Promise<OfferEntity[]> {
        return this.offerEntityRepository.find({ where: options, relations: ['nft', 'cauldron', 'cauldron.collateral'] });
    }

    public updateOne(where: Partial<OfferEntity>, doc: Partial<OfferEntity>) {
        return this.offerEntityRepository.update(where, doc);
    }

    public async checkIfExist(collateralId: string, nftId: number, type: OfferType): Promise<boolean> {
        const qb = await this.getOfferQueryBuilder()
            .where('collateral.id = :cauldronId', { collateralId })
            .andWhere('nft.tokenId = :nftId', { nftId })
            .andWhere('offer.type = :type', { type })
            .getCount();

        return qb > 1;
    }

    private getOfferQueryBuilder() {
        return this.offerEntityRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.cauldron', 'cauldron')
            .leftJoinAndSelect('cauldron.collateral', 'collateral')
            .leftJoinAndSelect('offer.nft', 'nft');
    }
}
