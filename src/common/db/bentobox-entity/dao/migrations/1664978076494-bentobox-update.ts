import { MigrationInterface, QueryRunner } from 'typeorm';

import { BENTOBOX_TABLE_NAME } from '../bentobox.entity';

export class BentoboxUpdate1664978076494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE bentoboxs_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${BENTOBOX_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${BENTOBOX_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE bentoboxs_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${BENTOBOX_TABLE_NAME} ALTER COLUMN network TYPE bentoboxs_network_enum_new USING network::text::bentoboxs_network_enum_new;
            DROP TYPE bentoboxs_network_enum;
            
            ALTER TYPE bentoboxs_network_enum_new RENAME TO bentoboxs_network_enum;
            
            ALTER TABLE ${BENTOBOX_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
