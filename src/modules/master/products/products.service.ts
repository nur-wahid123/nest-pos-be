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
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

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
    const checkCode = await this.productRepository.findOneBy({ code: createProductDto.code })
    if (checkCode) throw new BadRequestException('code already exists')
    const category = await this.categoryRepository.findOneBy({ id: createProductDto.categoryId })
    if (!category) throw new NotFoundException('category not found')
    const brand = await this.brandRepository.findOneBy({ id: createProductDto.brandId })
    if (!brand) throw new NotFoundException('brand not found')
    const uom = await this.uomRepo.findOneBy({ id: createProductDto.uomId })
    if (!uom) throw new NotFoundException('Unit not found')
    let supplier: Supplier
    if (createProductDto.supplierId) {
      supplier = await this.supplierRepo.findById(
        createProductDto.supplierId,
      );
      if (!supplier) throw new NotFoundException('supplier not found');
    }
    createProductDto.name = createProductDto?.name?.replace(/\s+/g, ' ').trim();

    const deletedProduct = await this.productRepository.findOne({ where: { code: createProductDto.code }, withDeleted: true })
    if (deletedProduct) {
      deletedProduct.deletedAt = null
      deletedProduct.deletedBy = null
      deletedProduct.category = category
      deletedProduct.brand = brand
      deletedProduct.uom = uom
      deletedProduct.supplier = supplier
      return this.productRepository.save(deletedProduct)
    }
    return this.productRepository.createProduct(createProductDto, category, brand, uom, userId, supplier)
  }

  async findAll(query: QueryProductListDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.productRepository.findProducts(query, pageOptionsDto)
    // const itemCount = data.length
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount })
    return new PageDto(data, pageMeta)
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
