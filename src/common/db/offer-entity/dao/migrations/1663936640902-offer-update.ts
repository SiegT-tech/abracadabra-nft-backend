import { MigrationInterface, QueryRunner } from 'typeorm';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1663936640902 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} ADD "deleted_at" timestamp;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${OFFER_TABLE_NAME} DROP "deleted_at";
        `);
    }
}
