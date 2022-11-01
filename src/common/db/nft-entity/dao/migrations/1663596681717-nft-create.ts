import { MigrationInterface, QueryRunner } from 'typeorm';

import { NFT_TABLE_NAME } from '../nft.entity';

export class NftCreate1663596681717 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${NFT_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token_id" numeric NOT NULL,
                "name" text,
                "description" text,
                "image" text,
                "owner" varchar(42) NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                "collateral_id" uuid,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${NFT_TABLE_NAME}" CASCADE;
        `);
    }
}
