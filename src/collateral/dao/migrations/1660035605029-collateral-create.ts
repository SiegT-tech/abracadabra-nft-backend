import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CollateralCreate1660035605029 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE collaterals_network_enum AS ENUM ('0', '1', '3');

            CREATE TABLE "${COLLATERAL_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" collaterals_network_enum NOT NULL DEFAULT '0'::collaterals_network_enum,
                "name" text NOT NULL,
                "base_uri" text,
                "total_supply" numeric,
                "address" varchar(42) NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${COLLATERAL_TABLE_NAME}" CASCADE;
            DROP TYPE collaterals_network_enum;
        `);
    }
}
