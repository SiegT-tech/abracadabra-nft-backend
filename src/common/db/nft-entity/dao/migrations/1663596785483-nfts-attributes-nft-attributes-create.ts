import { MigrationInterface, QueryRunner } from 'typeorm';

const TABLE_NAME = 'nfts_attributes_nft-attributes';

export class NftsAttributesNftAttributesCreate1663596785483 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${TABLE_NAME}" (
                "nfts_id" uuid NOT NULL,
                "nft-attributes_id" uuid NOT NULL,
                PRIMARY KEY ("nfts_id","nft-attributes_id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${TABLE_NAME}" CASCADE;
        `);
    }
}
