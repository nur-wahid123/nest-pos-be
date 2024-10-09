import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/repositories/product.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { BrandRepository } from 'src/repositories/brand.repository';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { UomRepository } from 'src/repositories/uom.repository';
import { Supplier } from 'src/entities/supplier.entity';
import { Product } from 'src/entities/product.entity';
import { QueryListDto } from '../categories/dto/query-list.dto';
import { Like } from 'typeorm';
import { QueryProductListDto } from './dto/query-product-list.dto';

@Injectable()
export class ProductsService {

  constructor(private readonly productRepository: ProductRepository
    , private readonly categoryRepository: CategoryRepository
    , private readonly brandRepository: BrandRepository
    , private readonly uomRepo: UomRepository
    , private readonly supplierRepo: SupplierRepository) { }

  init() {
    return this.productRepository.init()
  }

  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    let { brandId, buyPrice, categoryId, code, name, sellPrice, uomId, supplierId } = createProductDto
    const checkCode = await this.productRepository.findOneBy({ code: code })
    if (checkCode) throw new BadRequestException('code already exists')
    const category = await this.categoryRepository.findOneBy({ id: categoryId })
    if (!category) throw new NotFoundException('category not found')
    const brand = await this.brandRepository.findOneBy({ id: brandId })
    if (!brand) throw new NotFoundException('brand not found')
    const uom = await this.uomRepo.findOneBy({ id: uomId })
    if (!uom) throw new NotFoundException('Unit not found')
    let supplier: Supplier
    if (supplierId) {
      supplier = await this.supplierRepo.findById(
        supplierId,
      );
      if (!supplier) throw new NotFoundException('supplier not found');
    }
    name = createProductDto?.name?.replace(/\s+/g, ' ').trim();

    const deletedProduct = await this.productRepository.findOne({ where: { code: code }, withDeleted: true })
    if (deletedProduct) {
      deletedProduct.deletedAt = null
      deletedProduct.deletedBy = null
      deletedProduct.category = category
      deletedProduct.brand = brand
      deletedProduct.uom = uom
      deletedProduct.supplier = supplier
      deletedProduct.updatedBy = userId
      return this.productRepository.saveProduct(deletedProduct)
    }
    const product = new Product()
    product.category = category
    product.brand = brand
    product.uom = uom
    product.createdBy = userId
    product.buyPrice = buyPrice
    product.sellPrice = sellPrice
    product.name = name
    product.code = code
    if (supplierId) {
      product.supplier = supplier
    }
    return this.productRepository.saveProduct(product)
  }

  findAll(query: QueryProductListDto): Promise<Product[]> {
    return this.productRepository.findProducts(query)
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {

    const product = await this.productRepository.findOneBy({ id })
    if (!product) throw new NotFoundException('product not found')
    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOneBy({ id: updateProductDto.brandId })
      if (!brand) throw new NotFoundException('brand not found')
      product.brand = brand
    }
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateProductDto.categoryId })
      if (!category) throw new NotFoundException('category not found')
      product.category = category
    }
    if (updateProductDto.supplierId) {
      const supplier = await this.supplierRepo.findOneBy({ id: updateProductDto.supplierId })
      if (!supplier) throw new NotFoundException('supplier not found')
      product.supplier = supplier
    }
    if (updateProductDto.uomId) {
      const uom = await this.uomRepo.findOneBy({ id: updateProductDto.uomId })
      if (!uom) throw new NotFoundException('uom not found')
      product.uom = uom
    }
    product.name = updateProductDto?.name ?? product.name;
    product.code = updateProductDto?.code ?? undefined;
    product.buyPrice = updateProductDto?.buyPrice ?? product.buyPrice;
    product.sellPrice = updateProductDto?.sellPrice ?? product.sellPrice;

    product.updatedBy = userId

    return this.productRepository.save(product)

  }

  async remove(id: number, userId: number) {
    const product = await this.productRepository.findOneBy({ id })
    product.deletedBy = userId
    await this.productRepository.save(product)
    return this.productRepository.softDelete(id)
  }
}
