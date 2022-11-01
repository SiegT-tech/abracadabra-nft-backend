import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../cauldron.entity';

export class CauldronUpdate1660121732364 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${CAULDRON_TABLE_NAME} ADD "can_sync" bool;
            UPDATE "${CAULDRON_TABLE_NAME}" SET "can_sync" = true;
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ALTER COLUMN "can_sync" SET NOT NULL;

            ALTER TABLE ${CAULDRON_TABLE_NAME} ADD "deprecated" bool;
            UPDATE "${CAULDRON_TABLE_NAME}" SET "deprecated" = false;
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ALTER COLUMN "deprecated" SET NOT NULL;

            ALTER TABLE ${CAULDRON_TABLE_NAME} ADD "checked" bool;
            UPDATE "${CAULDRON_TABLE_NAME}" SET "checked" = true;
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ALTER COLUMN "checked" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${CAULDRON_TABLE_NAME} DROP "can_sync";
            ALTER TABLE ${CAULDRON_TABLE_NAME} DROP "deprecated";
            ALTER TABLE ${CAULDRON_TABLE_NAME} DROP "checked";
        `);
    }
}
