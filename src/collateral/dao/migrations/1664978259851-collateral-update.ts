import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CollateralUpdate1664978259851 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE collaterals_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${COLLATERAL_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${COLLATERAL_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE collaterals_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ALTER COLUMN network TYPE collaterals_network_enum_new USING network::text::collaterals_network_enum_new;
            DROP TYPE collaterals_network_enum;
            
            ALTER TYPE collaterals_network_enum_new RENAME TO collaterals_network_enum;
            
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
