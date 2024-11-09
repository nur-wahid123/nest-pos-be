import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      const brand = await queryRunner.manager.save(Brand, {
        ...createBrandDto,
        createdBy: userId,
      });
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
