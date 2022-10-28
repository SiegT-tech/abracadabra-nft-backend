import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CauldronUpdate1663921397000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "can_sync" bool;
            UPDATE "${COLLATERAL_TABLE_NAME}" SET "can_sync" = true;
            ALTER TABLE "${COLLATERAL_TABLE_NAME}" ALTER COLUMN "can_sync" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "creation_block";
        `);
    }
}
