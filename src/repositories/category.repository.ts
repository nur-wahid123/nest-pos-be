import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { codeFormater } from 'src/common/utils/auto-generate-code.util';
import Category from 'src/entities/category.entity';
import { QueryListDto } from 'src/modules/master/categories/dto/query-list.dto';
import { DataSource, Repository } from 'typeorm';

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

  async autoGenerateCode(): Promise<string> {
    const newDate = new Date();
    const lastRecord = await this.dataSource
      .createQueryBuilder(Category, 'category')
      .where(`EXTRACT(YEAR FROM category.createdAt) = :year`, {
        year: newDate.getFullYear(),
      })
      .andWhere('category.code like :pref', {
        pref: 'ET/CA%',
      })
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
