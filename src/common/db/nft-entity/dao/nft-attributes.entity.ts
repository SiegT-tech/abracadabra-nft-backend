import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CollateralEntity } from '../../collateral-entity/dao/collateral.entity';

export const NFT_ATTRIBUTES_TABLE_NAME = 'nft-attributes';

@Entity(NFT_ATTRIBUTES_TABLE_NAME)
export class NftAttributesEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => CollateralEntity, collateral => collateral.nftAttributes)
    @JoinColumn()
    public collateral: CollateralEntity;

    @Column('text', { nullable: true })
    public type: string;

    @Column('text', { nullable: true })
    public value: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
