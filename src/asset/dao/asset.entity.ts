import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Networks } from '../../blockchain/constants';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';

export const ASSET_TABLE_NAME = 'assets';

@Entity(ASSET_TABLE_NAME)
export class AssetEntity {
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

    @Column('text')
    public name: string;

    @Column('integer')
    public decimals: number;

    @OneToMany(() => CauldronEntity, cauldron => cauldron.asset)
    public cauldrons: CauldronEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
