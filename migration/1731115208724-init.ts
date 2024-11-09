import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1731115208724 implements MigrationInterface {
    name = 'Init1731115208724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."merchants_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "merchants" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "owner_name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying, "status" "public"."merchants_status_enum" NOT NULL DEFAULT 'inactive', "logo_url" character varying, "bannwebsiteer_url" character varying, CONSTRAINT "UQ_7726488db5747f0daca397ae6fe" UNIQUE ("code"), CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('female', 'male', 'unspecified')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "username" character varying(15) NOT NULL, "email" character varying(40), "age" integer, "password" character varying NOT NULL, "gender" "public"."users_gender_enum", "merchant_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "merchant_id" integer, CONSTRAINT "UQ_1687d82f42d8b3f8162a29e7df4" UNIQUE ("code"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_items" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "qty" integer NOT NULL, "buy_price" bigint NOT NULL, "sub_total" bigint NOT NULL, "merchant_id" integer, "purchase_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_e3d9bea880baad86ff6de3290da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "qty" integer NOT NULL DEFAULT '0', "merchant_id" integer, "product_id" integer NOT NULL, CONSTRAINT "REL_92fc0c77bab4a656b9619322c6" UNIQUE ("product_id"), CONSTRAINT "PK_7b1946392ffdcb50cfc6ac78c0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_ledger" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "qty" integer NOT NULL, "direction" integer NOT NULL, "qty_before_update" integer NOT NULL, "qty_after_update" integer NOT NULL, "merchant_id" integer, "inventory_id" integer NOT NULL, "purchase_id" integer, "sale_id" integer, CONSTRAINT "PK_56ba7cef08f3263f90418ddfeef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchases_payment_status_enum" AS ENUM('unpaid', 'partial_paid', 'paid', 'returned')`);
        await queryRunner.query(`CREATE TABLE "purchases" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "note" text NOT NULL DEFAULT '-', "date" date, "total" bigint NOT NULL, "payment_status" "public"."purchases_payment_status_enum" NOT NULL DEFAULT 'unpaid', "merchant_id" integer, "supplier_id" integer NOT NULL, CONSTRAINT "UQ_9c3f2a2e8581e48254d5a9e8cd5" UNIQUE ("code"), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_type_enum" AS ENUM('paid-off', 'partial')`);
        await queryRunner.query(`CREATE TABLE "payments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "date" date NOT NULL, "note" text NOT NULL DEFAULT '-', "paid" double precision DEFAULT '0', "payment_type" "public"."payments_payment_type_enum" NOT NULL, "merchant_id" integer, "sale_id" integer, "purchase_id" integer, CONSTRAINT "UQ_2b3c754ea3bf83cab000b8ed3d4" UNIQUE ("code"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "date" date NOT NULL, "due_date" date NOT NULL, "note" text, "total" bigint NOT NULL, "payment_status" character varying NOT NULL DEFAULT 'unpaid', "merchant_id" integer, CONSTRAINT "UQ_52107c4d0241a1ecf7b02d2c9ea" UNIQUE ("code"), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_items" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "price" bigint NOT NULL, "sub_total" bigint NOT NULL, "qty" integer NOT NULL, "merchant_id" integer, "sale_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_5a7dc5b4562a9e590528b3e08ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "uoms" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "merchant_id" integer, CONSTRAINT "PK_f207a792064e3032c8fe3922b22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "merchant_id" integer, CONSTRAINT "UQ_77d7eff8a7aaa05457a12b8007a" UNIQUE ("code"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "buy_price" bigint NOT NULL, "sell_price" bigint NOT NULL, "merchant_id" integer, "uom_id" integer NOT NULL, "category_id" integer NOT NULL, "brand_id" integer NOT NULL, "supplier_id" integer, CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "islands" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_741cd0ddac7633cc4d63c71a9cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "island_id" integer, CONSTRAINT "PK_2e4260eedbcad036ec53222e0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "capital" character varying, "province_id" integer, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "phone" character varying, "address" text, "merchant_id" integer, "city_id" integer, CONSTRAINT "UQ_6f01a03dcb1aa33822e19534cd6" UNIQUE ("code"), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fe996f039efa99e46d75761aad0" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_3c745ce89b7a455267d66cdfbe5" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_items" ADD CONSTRAINT "FK_0471e064adb86ea4f02a3474b8d" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_items" ADD CONSTRAINT "FK_607211d59b13e705a673a999ab5" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_items" ADD CONSTRAINT "FK_43694b2fa800ce38d2da9ce74d6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventories" ADD CONSTRAINT "FK_20f1f9f6f694508c94ff71a8105" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventories" ADD CONSTRAINT "FK_92fc0c77bab4a656b9619322c62" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" ADD CONSTRAINT "FK_5cf4cfa75b261925029158bf270" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" ADD CONSTRAINT "FK_bd54d8bba66dea6804eeff638db" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" ADD CONSTRAINT "FK_35a70a6aea2915067dfe908a8ee" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" ADD CONSTRAINT "FK_783fab9d29c6fc2af0fbdabdeca" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_2dfe6a47e4793fe4bd096cda3ca" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_d5fec047f705d5b510c19379b95" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c4a9a77d8ec9c37d3654a0d2ebc" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_a9272c4415ef64294b104e378ac" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_57a1f8699492fb94ce1352f787f" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_a93d8ad10b6a6912abfa8a4ecf0" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_items" ADD CONSTRAINT "FK_898add5c1ca84c52376db98e9ed" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_items" ADD CONSTRAINT "FK_c210a330b80232c29c2ad68462a" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_items" ADD CONSTRAINT "FK_4ecae62db3f9e9cc9a368d57adb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "uoms" ADD CONSTRAINT "FK_0f28351cffc18e8ea2d843cf947" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fbdf044b239bb50bf716896a64a" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_7d80d63e220c4511ab4b6595846" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_d3d435a1fbb494a6f4588144f8d" FOREIGN KEY ("uom_id") REFERENCES "uoms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_0ec433c1e1d444962d592d86c86" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_a255e4d3c0c5e1b12067af3cc47" FOREIGN KEY ("island_id") REFERENCES "islands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_52af18d505515614479e5c9f5e9" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_8f9ea78e9bdba12718102941517" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_755607e8ca43154637c37f41a38" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_755607e8ca43154637c37f41a38"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_8f9ea78e9bdba12718102941517"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_52af18d505515614479e5c9f5e9"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_a255e4d3c0c5e1b12067af3cc47"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_0ec433c1e1d444962d592d86c86"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_d3d435a1fbb494a6f4588144f8d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_7d80d63e220c4511ab4b6595846"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fbdf044b239bb50bf716896a64a"`);
        await queryRunner.query(`ALTER TABLE "uoms" DROP CONSTRAINT "FK_0f28351cffc18e8ea2d843cf947"`);
        await queryRunner.query(`ALTER TABLE "sale_items" DROP CONSTRAINT "FK_4ecae62db3f9e9cc9a368d57adb"`);
        await queryRunner.query(`ALTER TABLE "sale_items" DROP CONSTRAINT "FK_c210a330b80232c29c2ad68462a"`);
        await queryRunner.query(`ALTER TABLE "sale_items" DROP CONSTRAINT "FK_898add5c1ca84c52376db98e9ed"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_a93d8ad10b6a6912abfa8a4ecf0"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_57a1f8699492fb94ce1352f787f"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_a9272c4415ef64294b104e378ac"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c4a9a77d8ec9c37d3654a0d2ebc"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_d5fec047f705d5b510c19379b95"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_2dfe6a47e4793fe4bd096cda3ca"`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" DROP CONSTRAINT "FK_783fab9d29c6fc2af0fbdabdeca"`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" DROP CONSTRAINT "FK_35a70a6aea2915067dfe908a8ee"`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" DROP CONSTRAINT "FK_bd54d8bba66dea6804eeff638db"`);
        await queryRunner.query(`ALTER TABLE "inventory_ledger" DROP CONSTRAINT "FK_5cf4cfa75b261925029158bf270"`);
        await queryRunner.query(`ALTER TABLE "inventories" DROP CONSTRAINT "FK_92fc0c77bab4a656b9619322c62"`);
        await queryRunner.query(`ALTER TABLE "inventories" DROP CONSTRAINT "FK_20f1f9f6f694508c94ff71a8105"`);
        await queryRunner.query(`ALTER TABLE "purchase_items" DROP CONSTRAINT "FK_43694b2fa800ce38d2da9ce74d6"`);
        await queryRunner.query(`ALTER TABLE "purchase_items" DROP CONSTRAINT "FK_607211d59b13e705a673a999ab5"`);
        await queryRunner.query(`ALTER TABLE "purchase_items" DROP CONSTRAINT "FK_0471e064adb86ea4f02a3474b8d"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_3c745ce89b7a455267d66cdfbe5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fe996f039efa99e46d75761aad0"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "islands"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "uoms"`);
        await queryRunner.query(`DROP TABLE "sale_items"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_type_enum"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "inventory_ledger"`);
        await queryRunner.query(`DROP TABLE "inventories"`);
        await queryRunner.query(`DROP TABLE "purchase_items"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "merchants"`);
        await queryRunner.query(`DROP TYPE "public"."merchants_status_enum"`);
    }

}
