import { MigrationInterface, QueryRunner } from 'typeorm';

import { COLLATERAL_TABLE_NAME } from '../collateral.entity';

export class CollateralUpdate1666629514941 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS pg_trgm;

            ALTER TABLE ${COLLATERAL_TABLE_NAME} ADD COLUMN IF NOT EXISTS fts tsvector;

            UPDATE ${COLLATERAL_TABLE_NAME}
            SET fts = setweight(to_tsvector(COALESCE(name, '')), 'A') || setweight(to_tsvector(COALESCE(address, '')), 'B');

            CREATE INDEX IF NOT EXISTS ix_${COLLATERAL_TABLE_NAME}_fts_gin ON ${COLLATERAL_TABLE_NAME} USING gin(fts);

            CREATE TRIGGER trig_tsv_${COLLATERAL_TABLE_NAME}_iu
            BEFORE INSERT OR UPDATE OF name,address ON ${COLLATERAL_TABLE_NAME} FOR EACH ROW
            EXECUTE PROCEDURE tsvector_update_trigger(fts, 'pg_catalog.english', name, address);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP INDEX ix_${COLLATERAL_TABLE_NAME}_fts_gin;

            DROP TRIGGER trig_tsv_${COLLATERAL_TABLE_NAME}_iu ON ${COLLATERAL_TABLE_NAME};

            ALTER TABLE ${COLLATERAL_TABLE_NAME} DROP COLUMN fts;
        `);
    }
}
