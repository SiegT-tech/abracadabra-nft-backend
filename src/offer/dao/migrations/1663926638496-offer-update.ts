import { MigrationInterface, QueryRunner } from 'typeorm';

import { NFT_TABLE_NAME } from '../../../nft/dao/nft.entity';

import { OFFER_TABLE_NAME } from '../offer.entity';

export class OfferUpdate1663926638496 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${OFFER_TABLE_NAME}" DROP "token_id";
            ALTER TABLE "${OFFER_TABLE_NAME}" ADD "nft_id" uuid;
            ALTER TABLE "${OFFER_TABLE_NAME}" ADD CONSTRAINT "${NFT_TABLE_NAME}_id_key" FOREIGN KEY ("nft_id") REFERENCES "${NFT_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${OFFER_TABLE_NAME}" DROP CONSTRAINT "${NFT_TABLE_NAME}_id_key";
            ALTER TABLE "${OFFER_TABLE_NAME}" DROP "nft_id";
            ALTER TABLE "${OFFER_TABLE_NAME}" ADD "token_id" numeric;
        `);
    }
}
