import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import Brand from 'src/entities/brand.entity';
import { BrandRepository } from 'src/repositories/brand.repository';

@Injectable()
export class BrandsService {

  constructor(private readonly brandRepository: BrandRepository) { }

  create(createBrandDto: CreateBrandDto, userId: number): Promise<Brand> {
    const newBrand = new Brand()
    newBrand.code = createBrandDto?.code
    newBrand.name = createBrandDto?.name
    newBrand.createdBy = userId
    return this.brandRepository.save(newBrand)
  }

  findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  findOne(id: number): Promise<Brand> {
    return this.brandRepository.findOneBy({ id });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, userId: number): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException("Brand, not found")
    brand.name = updateBrandDto?.name
    brand.updatedBy = userId
    return this.brandRepository.save(brand)
  }

  async remove(id: number, userId: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException("Brand, not found")
    brand.deletedBy = userId
    await this.brandRepository.save(brand)
    return this.brandRepository.softDelete(id);
  }
}
