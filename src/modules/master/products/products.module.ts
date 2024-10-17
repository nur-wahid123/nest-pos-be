import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from 'src/repositories/product.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { BrandRepository } from 'src/repositories/brand.repository';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { UomRepository } from 'src/repositories/uom.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    CategoryRepository,
    BrandRepository,
    SupplierRepository,
    UomRepository,
  ],
})
export class ProductsModule {}
