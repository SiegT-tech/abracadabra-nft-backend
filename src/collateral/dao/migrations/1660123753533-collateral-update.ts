import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CauldronUpdate1660123753533 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "ids_start_from" int4;
            UPDATE "${COLLATERAL_TABLE_NAME}" SET "ids_start_from" = 0;
            ALTER TABLE "${COLLATERAL_TABLE_NAME}" ALTER COLUMN "ids_start_from" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "ids_start_from";
        `);
    }
}
