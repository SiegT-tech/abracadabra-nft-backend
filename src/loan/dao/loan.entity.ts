import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { Networks } from '../../blockchain/constants';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { NftEntity } from '../../nft/dao/nft.entity';
import { ColumnNumericTransformer } from '../../utils';

export const LOAN_TABLE_NAME = 'loans';

export enum LoanStatus {
    LOAN_INITIAL,
    LOAN_REQUESTED,
    LOAN_OUTSTANDING,
}

@Entity(LOAN_TABLE_NAME)
export class LoanEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('enum', {
        enum: Networks,
        nullable: false,
        default: Networks.UNKNOW,
    })
    public network: Networks;

    @ManyToOne(() => NftEntity, nft => nft.loans)
    @JoinColumn()
    public nft: NftEntity;

    @Column('enum', {
        enum: LoanStatus,
        nullable: false,
        default: LoanStatus.LOAN_INITIAL,
    })
    public status: LoanStatus;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public startTime: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public duration: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public valuation: number;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public annualInterestBPS: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public ltvBPS: number;

    @Column({ nullable: true, length: 42 })
    public oracle: string;

    @Column({ nullable: true, length: 42 })
    public borrower: string;

    @Column({ nullable: false, length: 42 })
    public lender: string;

    @ManyToOne(() => CauldronEntity, cauldron => cauldron.loans)
    @JoinColumn()
    public cauldron: CauldronEntity;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    public deletedAt?: Date;
}
