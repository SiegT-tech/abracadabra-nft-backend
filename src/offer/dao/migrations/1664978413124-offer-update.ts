import { MigrationInterface, QueryRunner } from 'typeorm';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1664978413124 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE offers_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${OFFER_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${OFFER_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE offers_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${OFFER_TABLE_NAME} ALTER COLUMN network TYPE offers_network_enum_new USING network::text::offers_network_enum_new;
            DROP TYPE offers_network_enum;
            
            ALTER TYPE offers_network_enum_new RENAME TO offers_network_enum;
            
            ALTER TABLE ${OFFER_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
