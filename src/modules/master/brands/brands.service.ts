import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import Brand from 'src/entities/brand.entity';
import { BrandRepository } from 'src/repositories/brand.repository';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly brandRepository: BrandRepository) {}

  create(createBrandDto: CreateBrandDto, userId: number): Promise<Brand> {
    return this.brandRepository.createBrand(createBrandDto, userId);
  }

  async findAll(query: FilterDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.brandRepository.findBrands(
      query,
      pageOptionsDto,
    );

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, pageMetaDto);
  }

  findOne(id: number): Promise<Brand> {
    return this.brandRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    userId: number,
  ): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException('Brand, not found');
    brand.name = updateBrandDto?.name;
    brand.updatedBy = userId;
    return this.brandRepository.updateBrand(brand);
  }

  async remove(id: number, userId: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException('Brand, not found');
    brand.deletedBy = userId;
    await this.brandRepository.save(brand);
    return this.brandRepository.softDelete(id);
  }
}
