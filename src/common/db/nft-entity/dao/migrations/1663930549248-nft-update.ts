import { MigrationInterface, QueryRunner } from 'typeorm';

import { NFT_TABLE_NAME } from '../nft.entity';

export class NftUpdate1663930549248 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${NFT_TABLE_NAME}" ADD "token_url" text;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${NFT_TABLE_NAME}" DROP "token_url";
        `);
    }
}
