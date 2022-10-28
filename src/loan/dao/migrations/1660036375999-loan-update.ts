import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../../../cauldron/dao/cauldron.entity';

import { LOAN_TABLE_NAME } from '../loan.entity';

export class LoanUpdate1660036375999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOAN_TABLE_NAME}" ADD CONSTRAINT "${CAULDRON_TABLE_NAME}_id_key" FOREIGN KEY ("cauldron_id") REFERENCES "${CAULDRON_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOAN_TABLE_NAME}" DROP CONSTRAINT "${CAULDRON_TABLE_NAME}_id_key";
        `);
    }
}
