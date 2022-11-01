import { MigrationInterface, QueryRunner } from 'typeorm';

import { ASSET_TABLE_NAME } from '../asset.entity';

export class AssetUpdate1664980617134 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE assets_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${ASSET_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${ASSET_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE assets_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${ASSET_TABLE_NAME} ALTER COLUMN network TYPE assets_network_enum_new USING network::text::assets_network_enum_new;
            DROP TYPE assets_network_enum;
            
            ALTER TYPE assets_network_enum_new RENAME TO assets_network_enum;
            
            ALTER TABLE ${ASSET_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
