import { Injectable, InternalServerErrorException } from "@nestjs/common";
import Brand from "src/entities/brand.entity";
import Category from "src/entities/category.entity";
import { Product } from "src/entities/product.entity";
import { Supplier } from "src/entities/supplier.entity";
import { Uom } from "src/entities/uom.entity";
import { CreateProductDto } from "src/modules/master/products/dto/create-product.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(private readonly dataSource: DataSource) {
        super(Product, dataSource.createEntityManager())
    }

    async saveProduct(
        product: Product
    ): Promise<Product> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            await queryRunner.manager.save(product, { chunk: 1000 })
            await queryRunner.commitTransaction()
            return product
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error);
            throw new InternalServerErrorException()
        } finally {
            await queryRunner.release()
        }
    }
}