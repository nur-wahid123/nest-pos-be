import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductAddImageColumn1731115090950 implements MigrationInterface {
    name = 'UpdateProductAddImageColumn1731115090950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image"`);
    }

}
