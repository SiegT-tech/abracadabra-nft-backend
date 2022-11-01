import { MigrationInterface, QueryRunner } from 'typeorm';

import { BENTOBOX_TABLE_NAME } from '../bentobox.entity';

export class BentoboxUpdate1660121591373 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${BENTOBOX_TABLE_NAME} ADD "can_sync" bool;
            UPDATE "${BENTOBOX_TABLE_NAME}" SET "can_sync" = true;
            ALTER TABLE "${BENTOBOX_TABLE_NAME}" ALTER COLUMN "can_sync" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${BENTOBOX_TABLE_NAME} DROP "can_sync";
        `);
    }
}
