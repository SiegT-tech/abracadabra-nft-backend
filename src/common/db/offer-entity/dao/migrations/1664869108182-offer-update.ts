import { MigrationInterface, QueryRunner } from 'typeorm';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1664869108182 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} ADD "nonce" numeric;
            UPDATE "${OFFER_TABLE_NAME}" SET "nonce" = 0;
            ALTER TABLE "${OFFER_TABLE_NAME}" ALTER COLUMN "nonce" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} DROP "nonce";
        `);
    }
}
