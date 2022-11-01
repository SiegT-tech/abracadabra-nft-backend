import { MigrationInterface, QueryRunner } from 'typeorm';

import { BENTOBOX_TABLE_NAME } from '../bentobox.entity';

export class BentoboxCreate1660035415362 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE bentoboxs_network_enum AS ENUM ('0', '1', '3');

            CREATE TABLE "${BENTOBOX_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" bentoboxs_network_enum NOT NULL DEFAULT '0'::bentoboxs_network_enum,
                "address" varchar(42) NOT NULL,
                "creation_block" numeric NOT NULL,
                "last_sync_block" numeric,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${BENTOBOX_TABLE_NAME}" CASCADE;
            DROP TYPE bentoboxs_network_enum;
        `);
    }
}
