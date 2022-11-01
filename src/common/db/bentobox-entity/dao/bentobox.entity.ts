import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../../utils';
import { Networks } from '../../../modules/blockchain/constants';
import { CauldronEntity } from '../../cauldron-entity/dao/cauldron.entity';

export const BENTOBOX_TABLE_NAME = 'bentoboxs';

@Entity(BENTOBOX_TABLE_NAME)
export class BentoboxEntity {
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
    public creationBlock: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public lastSyncBlock: number;

    @OneToMany(() => CauldronEntity, cauldron => cauldron.bentobox)
    public cauldrons: CauldronEntity[];

    @Column({ default: false, nullable: false })
    public canSync: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
