import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../../utils';
import { Networks } from '../../../modules/blockchain/constants';
import { CauldronEntity } from '../../cauldron-entity/dao/cauldron.entity';
import { NftEntity } from '../../nft-entity/dao/nft.entity';

import { OfferType } from '../types';

export const OFFER_TABLE_NAME = 'offers';

@Entity(OFFER_TABLE_NAME)
export class OfferEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('enum', {
        enum: Networks,
        nullable: false,
        default: Networks.UNKNOW,
    })
    public network: Networks;

    @Column({ nullable: false, length: 42 })
    public address: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public duration: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public valuation: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public annualInterestBPS: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public deadline: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public nonce: number;

    @ManyToOne(() => NftEntity, nft => nft.offers)
    @JoinColumn()
    public nft: NftEntity;

    @Column('text', { nullable: false })
    public signature: string;

    @Column('enum', {
        enum: OfferType,
        nullable: false,
        default: OfferType.UNKNOW,
    })
    public type: OfferType;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public ltvBPS?: number;

    @Column({ nullable: true, length: 42 })
    public oracle?: string;

    @ManyToOne(() => CauldronEntity, cauldron => cauldron.offers)
    @JoinColumn()
    public cauldron: CauldronEntity;

    @Column('boolean', { nullable: true })
    public anyTokenId?: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    public deletedAt: Date;
}
