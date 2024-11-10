import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSaleTableAddBuyPriceColumn1731235539651 implements MigrationInterface {
    name = 'UpdateSaleTableAddBuyPriceColumn1731235539651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_items" ADD "buy_price" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_items" DROP COLUMN "buy_price"`);
    }

}
