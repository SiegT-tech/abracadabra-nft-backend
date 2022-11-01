import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOAN_TABLE_NAME } from '../loan.entity';

export class LoanUpdate1666263020135 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${LOAN_TABLE_NAME} ADD "oracle" varchar(42);
            ALTER TABLE ${LOAN_TABLE_NAME} ADD "ltv_bps" numeric;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${LOAN_TABLE_NAME} DROP "oracle";
            ALTER TABLE ${LOAN_TABLE_NAME} DROP "ltv_bps";
        `);
    }
}
