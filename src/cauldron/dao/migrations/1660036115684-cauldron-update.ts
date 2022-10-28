import { MigrationInterface, QueryRunner } from 'typeorm';

import { ASSET_TABLE_NAME } from '../../../asset/dao/asset.entity';
import { BENTOBOX_TABLE_NAME } from '../../../bentobox/dao/bentobox.entity';
import { COLLATERAL_TABLE_NAME } from '../../../collateral/dao/collateral.entity';

import { CAULDRON_TABLE_NAME } from '../cauldron.entity';

export class CauldronUpdate1660036115684 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ADD CONSTRAINT "${BENTOBOX_TABLE_NAME}_id_key" FOREIGN KEY ("bentobox_id") REFERENCES "${BENTOBOX_TABLE_NAME}"("id");
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ADD CONSTRAINT "${ASSET_TABLE_NAME}_id_key" FOREIGN KEY ("asset_id") REFERENCES "${ASSET_TABLE_NAME}"("id");
            ALTER TABLE "${CAULDRON_TABLE_NAME}" ADD CONSTRAINT "${COLLATERAL_TABLE_NAME}_id_key" FOREIGN KEY ("collateral_id") REFERENCES "${COLLATERAL_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${CAULDRON_TABLE_NAME}" DROP CONSTRAINT "${BENTOBOX_TABLE_NAME}_id_key";
            ALTER TABLE "${CAULDRON_TABLE_NAME}" DROP CONSTRAINT "${ASSET_TABLE_NAME}_id_key";
            ALTER TABLE "${CAULDRON_TABLE_NAME}" DROP CONSTRAINT "${COLLATERAL_TABLE_NAME}_id_key";
        `);
    }
}
