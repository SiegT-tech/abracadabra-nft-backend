import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../../../collateral/dao/collateral.entity';

import { NFT_TABLE_NAME } from '../nft.entity';

export class NftUpdate1663597097289 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${NFT_TABLE_NAME}" ADD CONSTRAINT "${COLLATERAL_TABLE_NAME}_id_key" FOREIGN KEY ("collateral_id") REFERENCES "${COLLATERAL_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${NFT_TABLE_NAME}" DROP CONSTRAINT "${COLLATERAL_TABLE_NAME}_id_key";
        `);
    }
}
