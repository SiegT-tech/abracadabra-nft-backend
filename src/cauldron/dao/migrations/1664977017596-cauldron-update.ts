import { MigrationInterface, QueryRunner } from 'typeorm';

import { CAULDRON_TABLE_NAME } from '../cauldron.entity';

export class CauldronUpdate1664977017596 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE cauldrons_network_enum ADD VALUE '137';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${CAULDRON_TABLE_NAME} SET "network" = '0' WHERE "network" = '137';

            ALTER TABLE ${CAULDRON_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE cauldrons_network_enum_new AS ENUM ('0', '1', '3');
            ALTER TABLE ${CAULDRON_TABLE_NAME} ALTER COLUMN network TYPE cauldrons_network_enum_new USING network::text::cauldrons_network_enum_new;
            DROP TYPE cauldrons_network_enum;
            
            ALTER TYPE cauldrons_network_enum_new RENAME TO cauldrons_network_enum;
            
            ALTER TABLE ${CAULDRON_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
