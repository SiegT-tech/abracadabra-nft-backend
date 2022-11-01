import { MigrationInterface, QueryRunner } from 'typeorm';

import { NFT_ATTRIBUTES_TABLE_NAME } from '../nft-attributes.entity';
import { NFT_TABLE_NAME } from '../nft.entity';

const TABLE_NAME = 'nfts_attributes_nft-attributes';

export class NftsAttributesNftAttributesUpdate1663597178621 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${TABLE_NAME}" ADD CONSTRAINT "${NFT_TABLE_NAME}_id_key" FOREIGN KEY ("nfts_id") REFERENCES "${NFT_TABLE_NAME}"("id");
            ALTER TABLE "${TABLE_NAME}" ADD CONSTRAINT "${NFT_ATTRIBUTES_TABLE_NAME}_id_key" FOREIGN KEY ("nft-attributes_id") REFERENCES "${NFT_ATTRIBUTES_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${TABLE_NAME}" DROP CONSTRAINT "${NFT_TABLE_NAME}_id_key";
            ALTER TABLE "${TABLE_NAME}" DROP CONSTRAINT "${NFT_ATTRIBUTES_TABLE_NAME}_id_key";
        `);
    }
}
