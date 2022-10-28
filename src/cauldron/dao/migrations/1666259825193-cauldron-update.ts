import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../cauldron.entity';

export class CauldronUpdate1666259825193 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${CAULDRON_TABLE_NAME} ADD "oracle" bool;
            UPDATE "${CAULDRON_TABLE_NAME}" SET "oracle" = false;
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ALTER COLUMN "oracle" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${CAULDRON_TABLE_NAME} DROP "oracle";
        `);
    }
}
