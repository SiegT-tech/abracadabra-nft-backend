import { MigrationInterface, QueryRunner } from 'typeorm';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1666263365996 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} ADD "oracle" varchar(42);
            ALTER TABLE ${OFFER_TABLE_NAME} ADD "ltv_bps" numeric;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} DROP "oracle";
            ALTER TABLE ${OFFER_TABLE_NAME} DROP "ltv_bps";
        `);
    }
}
