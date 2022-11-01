import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../../utils';
import { Networks } from '../../../modules/blockchain/constants';
import { CauldronEntity } from '../../cauldron-entity/dao/cauldron.entity';
import { NftAttributesEntity } from '../../nft-entity/dao/nft-attributes.entity';
import { NftEntity } from '../../nft-entity/dao/nft.entity';

export const COLLATERAL_TABLE_NAME = 'collaterals';

@Entity(COLLATERAL_TABLE_NAME)
export class CollateralEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('enum', {
        enum: Networks,
        nullable: false,
        default: Networks.UNKNOW,
    })
    public network: Networks;

    @Column('text')
    public name: string;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public totalSupply: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public idsStartFrom: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public floorPrice: number;

    @Column({ nullable: false, length: 42 })
    public address: string;

    @Column('text', { nullable: true })
    public banner: string;

    @Column('text', { nullable: true })
    public logo: string;

    @OneToMany(() => CauldronEntity, cauldron => cauldron.collateral)
    public cauldrons: CauldronEntity[];

    @OneToMany(() => NftEntity, nft => nft.collateral)
    public nfts: NftEntity[];

    @OneToMany(() => NftAttributesEntity, nftAttributes => nftAttributes.collateral)
    public nftAttributes: NftAttributesEntity[];

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public lastSyncBlock: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public creationBlock: number;

    @Column({ nullable: true, type: 'tsvector' })
    public fts?: string;

    @Column({ default: true, nullable: false })
    public canSync: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
