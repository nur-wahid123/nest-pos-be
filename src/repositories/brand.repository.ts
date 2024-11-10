import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import Brand from 'src/entities/brand.entity';
import { CreateBrandDto } from 'src/modules/master/brands/dto/create-brand.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BrandRepository extends Repository<Brand> {
  constructor(private readonly datasource: DataSource) {
    super(Brand, datasource.manager);
  }

  async findBrands(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const { code, search } = filter;
    const { skip,page, take } = pageOptionsDto;
    const query = this.datasource
      .createQueryBuilder(Brand, 'brand')
      .where((qb) => {
        code &&
          qb.andWhere(`(lower(brand.code) like lower(:code))`, {
            code: `%${code}%`,
          });
        search &&
          qb.andWhere(
            `(
        lower(brand.name) like lower(:search) or
        lower(brand.code) like lower(:search)
        )`,
            { search: `%${search}%` },
          );
      });

    if (
      page && take
    ) {
      query.skip(skip).take(take);
    }

    return query.getManyAndCount();
  }

  async createBrand(
    createBrandDto: CreateBrandDto,
    userId: number,
  ): Promise<Brand> {

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingBrandCode = await queryRunner.manager.findOne(Brand, {
        where: {
          code: createBrandDto.code
        }
      })
      if (existingBrandCode) {
        throw new NotFoundException('Brand code already exists');
      }
      const codeRegex = /^[a-zA-Z]{1,10}$/;
      if (!codeRegex.test(createBrandDto.code)) {
        throw new BadRequestException('Brand code must be a string, no space, no number or any other character, only a - z and maximum length of 10');
      }
      const brand = new Brand()
      brand.name = createBrandDto.name;
      brand.code = createBrandDto.code.toUpperCase();
      brand.createdBy = userId;
      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();
      return brand;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error
    } finally {
      await queryRunner.release();
    }
  }
  async updateBrand(
    brand: Brand,
  ): Promise<Brand> {

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();
      return brand;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('eror');
    } finally {
      await queryRunner.release();
    }
  }


}
