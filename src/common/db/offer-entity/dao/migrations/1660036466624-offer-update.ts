import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../../../cauldron-entity/dao/cauldron.entity';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1660036466624 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${OFFER_TABLE_NAME}" ADD CONSTRAINT "${CAULDRON_TABLE_NAME}_id_key" FOREIGN KEY ("cauldron_id") REFERENCES "${CAULDRON_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${OFFER_TABLE_NAME}" DROP CONSTRAINT "${CAULDRON_TABLE_NAME}_id_key";
        `);
    }
}
