import { MigrationInterface, QueryRunner } from 'typeorm';

import { NFT_ATTRIBUTES_TABLE_NAME } from '../nft-attributes.entity';

export class NftAttributesCreate1663596581889 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${NFT_ATTRIBUTES_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" text,
                "value" text,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                "collateral_id" uuid,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${NFT_ATTRIBUTES_TABLE_NAME}" CASCADE;
        `);
    }
}
