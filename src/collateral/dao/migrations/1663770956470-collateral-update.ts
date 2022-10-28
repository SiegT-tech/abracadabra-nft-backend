import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CauldronUpdate1663770956470 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "creation_block" numeric;
            UPDATE "${COLLATERAL_TABLE_NAME}" SET "creation_block" = 0;
            ALTER TABLE "${COLLATERAL_TABLE_NAME}" ALTER COLUMN "creation_block" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "creation_block";
        `);
    }
}
