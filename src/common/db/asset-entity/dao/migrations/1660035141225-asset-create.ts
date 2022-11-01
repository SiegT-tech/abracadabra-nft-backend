import { MigrationInterface, QueryRunner } from 'typeorm';

import { ASSET_TABLE_NAME } from '../asset.entity';

export class AssetCreate1660035141225 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE assets_network_enum AS ENUM ('0', '1', '3');

            CREATE TABLE "${ASSET_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" assets_network_enum NOT NULL DEFAULT '0'::assets_network_enum,
                "address" varchar(42) NOT NULL,
                "name" text NOT NULL,
                "decimals" int4 NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${ASSET_TABLE_NAME}" CASCADE;
            DROP TYPE assets_network_enum;
        `);
    }
}
