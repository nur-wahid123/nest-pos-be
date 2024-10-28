import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import Brand from 'src/entities/brand.entity';
import Category from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Uom } from 'src/entities/uom.entity';
import { CreateProductDto } from 'src/modules/master/products/dto/create-product.dto';
import { QueryProductListDto } from 'src/modules/master/products/dto/query-product-list.dto';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async init() {
    const response = await fetch('https://dummyjson.com/products?limit=194');
    const { products } = await response.json();
    // return products[0]

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      // console.log(data.products[1]);
      const newProducts: Product[] = [];
      for (let index = 0; index < products.length; index++) {
        // for (let index = 0; index < 2; index++) {
        const product = products[index];

        const existedProduct = await queryRunner.manager.findOne(Product, {
          where: { code: product.sku },
        });
        if (existedProduct) {
          continue;
        }

        const newProduct = new Product();
        // return { msg: 'success' }
        newProduct.code = product.sku;
        newProduct.name = product.title;

        let existedBrand = await queryRunner.manager.findOne(Brand, {
          where: { code: product.brand },
        });
        if (!existedBrand) {
          existedBrand = new Brand();
          existedBrand.code = product.brand;
          existedBrand.name = product.brand;
          await queryRunner.manager.save(existedBrand);
        }
        newProduct.brand = existedBrand;

        let existedCategory = await queryRunner.manager.findOne(Category, {
          where: { code: product.category },
        });
        if (!existedCategory) {
          existedCategory = new Category();
          existedCategory.code = product.category;
          existedCategory.name = product.category;
          await queryRunner.manager.save(existedCategory);
        }
        newProduct.category = existedCategory;

        let existedUom = await queryRunner.manager.findOne(Uom, {
          where: { name: product.unit },
        });
        if (!existedUom) {
          existedUom = new Uom();
          existedUom.name = product.unit;
          existedUom.description = product.unit;
          await queryRunner.manager.save(existedUom);
        }
        newProduct.uom = existedUom;

        newProduct.buyPrice = Math.ceil(Number(product.price) * 15670); // product.price
        newProduct.sellPrice = Math.ceil(Number(product.price) * 15670); // product.price
        newProducts.push(newProduct); // newProduct
      }

      await queryRunner.manager.save(newProducts, { chunk: 1000 });
      await queryRunner.commitTransaction();
      return newProducts;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
  async saveProduct(product: Product): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.save(product, { chunk: 1000 });
      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async findProducts(filter: QueryProductListDto, pageOptions: PageOptionsDto) {
    const { skip, take } = pageOptions;
    const query = this.dataSource.createQueryBuilder(Product, 'product')
      .leftJoin('product.brand', 'brand')
      .leftJoin('product.category', 'category')
      .leftJoin('product.uom', 'uom')
      .leftJoin('product.inventory', 'inventory')
      .addSelect([
        'brand.id',
        'brand.code',
        'brand.name',
        'category.id',
        'category.code',
        'category.name',
        'uom.id',
        'uom.name',
        'uom.description',
        'inventory.qty',
      ])
      .where((qb) => {
        this.applyFilters(qb, filter);
      });

    console.log(take, skip);

    // Properly check for skip and take values
    if (typeof skip === 'number' && typeof take === 'number' && !Number.isNaN(take) && !Number.isNaN(skip)) {
      query.offset(skip).limit(take);
    }

    return await query.getManyAndCount();
  }

  applyFilters(qb: SelectQueryBuilder<Product>, query: QueryProductListDto) {
    const { categoryId, search, code } = query;

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }
    if (search) {
      qb.andWhere(`(
        lower(product.name) like lower(:search) or 
        lower(product.code) like lower(:search) or 
        lower(brand.name) like lower(:search)
        )`, {
        search: `%${search}%`,
      });
    }
    if (code) {
      qb.andWhere('(lower(product.code) like lower(:code))', {
        code: `%${code}%`,
      });
    }
  }

}
