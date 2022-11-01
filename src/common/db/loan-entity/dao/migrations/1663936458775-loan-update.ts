import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOAN_TABLE_NAME } from '../loan.entity';

export class LoanUpdate1663936458775 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${LOAN_TABLE_NAME} ADD "deleted_at" timestamp;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${LOAN_TABLE_NAME} DROP "deleted_at";
        `);
    }
}
