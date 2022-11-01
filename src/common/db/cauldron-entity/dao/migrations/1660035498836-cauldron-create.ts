import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../cauldron.entity';

export class CauldronCreate1660035498836 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE cauldrons_network_enum AS ENUM ('0', '1', '3');

            CREATE TABLE "${CAULDRON_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" cauldrons_network_enum NOT NULL DEFAULT '0'::cauldrons_network_enum,
                "address" varchar(42) NOT NULL,
                "master_contract" varchar(42) NOT NULL,
                "creation_block" numeric NOT NULL,
                "last_sync_block" numeric,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                "bentobox_id" uuid,
                "collateral_id" uuid,
                "asset_id" uuid,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${CAULDRON_TABLE_NAME}" CASCADE;
            DROP TYPE cauldrons_network_enum;
        `);
    }
}
