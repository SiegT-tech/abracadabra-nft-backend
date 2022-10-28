import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CauldronUpdate1663600477226 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "last_sync_block" numeric;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "last_sync_block";
        `);
    }
}
