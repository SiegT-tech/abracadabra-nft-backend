import { MigrationInterface, QueryRunner } from 'typeorm';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferCreate1660035805716 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE offers_network_enum AS ENUM ('0', '1', '3');
            CREATE TYPE offers_type_enum AS ENUM ('0', '1', '2');

            CREATE TABLE "${OFFER_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" offers_network_enum NOT NULL DEFAULT '0'::offers_network_enum,
                "address" varchar(42) NOT NULL,
                "duration" numeric NOT NULL,
                "valuation" numeric NOT NULL,
                "annual_interest_bps" numeric NOT NULL,
                "deadline" numeric NOT NULL,
                "token_id" numeric NOT NULL,
                "signature" text NOT NULL,
                "type" offers_type_enum NOT NULL DEFAULT '0'::offers_type_enum,
                "any_token_id" bool,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                "cauldron_id" uuid,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${OFFER_TABLE_NAME}" CASCADE;
            DROP TYPE offers_network_enum;
            DROP TYPE offers_type_enum;
        `);
    }
}
