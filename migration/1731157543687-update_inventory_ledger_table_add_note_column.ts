import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInventoryLedgerTableAddNoteColumn1731157543687 implements MigrationInterface {
    name = 'UpdateInventoryLedgerTableAddNoteColumn1731157543687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_ledger" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_ledger" DROP COLUMN "note"`);
    }

}
