import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../../utils';
import { Networks } from '../../../modules/blockchain/constants';
import { AssetEntity } from '../../asset-entity/dao/asset.entity';
import { BentoboxEntity } from '../../bentobox-entity/dao/bentobox.entity';
import { CollateralEntity } from '../../collateral-entity/dao/collateral.entity';
import { LoanEntity } from '../../loan-entity/dao/loan.entity';
import { OfferEntity } from '../../offer-entity/dao/offer.entity';

export const CAULDRON_TABLE_NAME = 'cauldrons';

@Entity(CAULDRON_TABLE_NAME)
export class CauldronEntity {
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

    @Column({ nullable: false, length: 42 })
    public masterContract: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public creationBlock: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public lastSyncBlock: number;

    @OneToMany(() => LoanEntity, loan => loan.cauldron)
    public loans: LoanEntity[];

    @ManyToOne(() => BentoboxEntity, bentobox => bentobox.cauldrons)
    @JoinColumn()
    public bentobox: BentoboxEntity;

    @ManyToOne(() => CollateralEntity, collateral => collateral.cauldrons)
    @JoinColumn()
    public collateral: CollateralEntity;

    @OneToMany(() => OfferEntity, offer => offer.cauldron)
    public offers: OfferEntity[];

    @ManyToOne(() => AssetEntity, asset => asset.cauldrons)
    @JoinColumn()
    public asset: AssetEntity;

    @Column({ default: false, nullable: false })
    public canSync: boolean;

    @Column({ default: false, nullable: false })
    public deprecated: boolean;

    @Column({ default: false, nullable: false })
    public checked: boolean;

    @Column({ default: false, nullable: false })
    public oracle: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
