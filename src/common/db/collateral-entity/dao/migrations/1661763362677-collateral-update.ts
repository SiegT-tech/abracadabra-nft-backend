import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CauldronUpdate1661763362677 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD "logo" text;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP "logo";
        `);
    }
}
