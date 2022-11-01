import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CollateralUpdate1666695978850 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "floor_price" numeric;
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "banner" text;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "floor_price";
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "banner";
        `);
    }
}
