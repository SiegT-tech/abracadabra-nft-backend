import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../../utils';
import { CollateralEntity } from '../../collateral-entity/dao/collateral.entity';
import { LoanEntity } from '../../loan-entity/dao/loan.entity';
import { OfferEntity } from '../../offer-entity/dao/offer.entity';

import { NftAttributesEntity } from './nft-attributes.entity';

export const NFT_TABLE_NAME = 'nfts';

@Entity(NFT_TABLE_NAME)
export class NftEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public tokenId: number;

    @Column('text', { nullable: true })
    public tokenUrl?: string;

    @ManyToOne(() => CollateralEntity, collateral => collateral.nfts)
    @JoinColumn()
    public collateral: CollateralEntity;

    @Column('text', { nullable: true })
    public name?: string;

    @Column('text', { nullable: true })
    public description?: string;

    @Column('text', { nullable: true })
    public image?: string;

    @ManyToMany(() => NftAttributesEntity)
    @JoinTable()
    public attributes: NftAttributesEntity[];

    @OneToMany(() => LoanEntity, loan => loan.nft)
    public loans: LoanEntity[];

    @OneToMany(() => OfferEntity, offer => offer.nft)
    public offers: OfferEntity[];

    @Column({ nullable: false, length: 42 })
    public owner: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
