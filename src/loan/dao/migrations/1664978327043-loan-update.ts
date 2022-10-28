import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOAN_TABLE_NAME } from '../loan.entity';

export class LoanUpdate1664978327043 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE loans_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${LOAN_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${LOAN_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE loans_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${LOAN_TABLE_NAME} ALTER COLUMN network TYPE loans_network_enum_new USING network::text::loans_network_enum_new;
            DROP TYPE loans_network_enum;
            
            ALTER TYPE loans_network_enum_new RENAME TO loans_network_enum;
            
            ALTER TABLE ${LOAN_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
