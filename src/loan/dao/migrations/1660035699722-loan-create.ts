import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOAN_TABLE_NAME } from '../loan.entity';

export class LoanCreate1660035699722 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE loans_network_enum AS ENUM ('0', '1', '3');
            CREATE TYPE loans_status_enum AS ENUM ('0', '1', '2');

            CREATE TABLE "${LOAN_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "network" loans_network_enum NOT NULL DEFAULT '0'::loans_network_enum,
                "token_id" numeric NOT NULL,
                "status" loans_status_enum NOT NULL DEFAULT '0'::loans_status_enum,
                "start_time" numeric NOT NULL,
                "duration" numeric NOT NULL,
                "valuation" numeric NOT NULL,
                "annual_interest_bps" numeric NOT NULL,
                "borrower" varchar(42) NOT NULL,
                "lender" varchar(42) NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                "cauldron_id" uuid,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${LOAN_TABLE_NAME}" CASCADE;
            DROP TYPE loans_network_enum;
            DROP TYPE loans_status_enum;
        `);
    }
}
