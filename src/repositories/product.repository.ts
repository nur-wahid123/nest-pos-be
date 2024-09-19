import { Injectable } from "@nestjs/common";
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

    async createProduct(
        createDto: CreateProductDto,
        category: Category,
        brand: Brand,
        uom: Uom,
        userId: number,
        supplier?: Supplier
    ): Promise<Product> {
        const ett = this.dataSource.createEntityManager()
        const product = ett.create(Product, {
            ...createDto, supplier, brand, category, uom, createdBy: userId
        })
        return await ett.save(product)
    }
}