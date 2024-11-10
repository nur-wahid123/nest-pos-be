import { BadRequestException, Injectable } from '@nestjs/common';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { codeFormater, codeFormaterWithOutLocation } from 'src/common/utils/auto-generate-code.util';
import Category from 'src/entities/category.entity';
import { QueryListDto } from 'src/modules/master/categories/dto/query-list.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findCategories(query: QueryListDto,pageOptionsDto:PageOptionsDto) {
    const { search } = query;
    const {page,take,skip} = pageOptionsDto
    const queryBuilder = this.createQueryBuilder('category').orderBy(
      'category.name',
      'ASC',
    );
    if (search) {
      queryBuilder.where('lower(category.name) like lower(:search)', {
        search: `%${search}%`,
      });
    }
    console.log(page,take,skip);
    
    if(page && take){
      queryBuilder.skip(skip).take(take)
    }

    const [data,itemCount] = await queryBuilder.getManyAndCount();
    const meta = new PageMetaDto({itemCount,pageOptionsDto});
    return new PageDto(data,meta)

  }
  findCategoriesCasheer(query: QueryListDto): Promise<Category[]> {
    const { search } = query;
    const queryBuilder = this.createQueryBuilder('category')
      .leftJoin('category.products', 'products')
      .leftJoin('products.inventory', 'inventory')
      .orderBy('category.name', 'ASC');
    queryBuilder.where((qb) => {
      if (search) {

        qb.andWhere('lower(category.name) like lower(:search)', {
          search: `%${search}%`,
        });
      }
      qb.andWhere(`inventory.qty > 0`);
    });
    queryBuilder.groupBy('category.id');

    return queryBuilder.getMany();
  }

  async updateCategory(category: Category): Promise<Category> {
    const qR = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      await qR.manager.save(category);
      await qR.commitTransaction();
      return category;
    } catch (error) {
      await qR.rollbackTransaction();
      throw error;
    } finally {
      await qR.release();
    }
  }

  async saveCategory(category: Category): Promise<Category> {
    const qR = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      const foundCategory = await qR.manager.createQueryBuilder(Category,'category').where('lower(category.name) = lower(:name)',{name:category.name}).getOne()
      if(foundCategory){
        throw new BadRequestException(['Category name already exists'])
      }
      category.code = await this.autoGenerateCode(qR);
      await qR.manager.save(category);
      await qR.commitTransaction();
      return category;
    } catch (error) {
      await qR.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await qR.release();
    }
  }

  async autoGenerateCode(qr: QueryRunner): Promise<string> {
    const newDate = new Date();
    const lastRecord = await qr.manager
      .createQueryBuilder(Category, 'category')
      .where(`EXTRACT(YEAR FROM category.createdAt) = :year`, {
        year: newDate.getFullYear(),
      })
      .andWhere('category.code like :pref', {
        pref: 'ET/CA%',
      })
      .setLock('pessimistic_write')
      .orderBy('category.code', 'DESC')
      .getOne();
    return await codeFormater(
      'ET',
      'CA',
      newDate,
      lastRecord ? lastRecord.code : null,
    );
  }
}
