import { MigrationInterface, QueryRunner } from 'typeorm';

import { BENTOBOX_TABLE_NAME } from '../bentobox.entity';

export class BentoboxInsert1660035922830 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        INSERT INTO "${BENTOBOX_TABLE_NAME}" ("id", "network", "address", "creation_block", "last_sync_block", "created_at", "updated_at") VALUES
        ('45bfa2bc-11c3-40ec-bd40-6f41126ef7da', '3', '0x9A5620779feF1928eF87c1111491212efC2C3cB8', 12212442, NULL, '2022-05-03 18:26:50.743327', '2022-08-08 15:09:22.062936');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DELETE FROM "${BENTOBOX_TABLE_NAME}" WHERE id = "45bfa2bc-11c3-40ec-bd40-6f41126ef7da";
        `);
    }
}
