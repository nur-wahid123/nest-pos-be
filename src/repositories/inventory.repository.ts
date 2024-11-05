import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { Inventory } from 'src/entities/inventory.entity';
import { Product } from 'src/entities/product.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private readonly dataSource: DataSource) {
    super(Inventory, dataSource.manager);
  }

  async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const { take, page, skip, order } = pageOptionsDto;
    const query = this.dataSource
      .createQueryBuilder(Product, 'product')
      .leftJoinAndSelect('product.inventory', 'inventory')
      .leftJoinAndSelect('product.uom', 'uom')
      .leftJoin('product.brand', 'brand')
      .leftJoin('product.category', 'category')
      .leftJoinAndSelect('inventory.inventoryLedgers', 'inventoryLedgers')
      .where((qb) => {
        this.applyFilters(qb, filter);
      })
      .orderBy('product.name', order);
    if (page && skip) {
      query.skip(take);
      query.take(skip);
    }
    return await query.getManyAndCount();
  }

  applyFilters(qb: any, filter: FilterDto) {
    const { code, search } = filter;
    code &&
      qb.andWhere(`(lower(product.code) like lower(:code))`, {
        code: `%${code}%`,
      });
    search &&
      qb.andWhere(`(lower(product.name) like lower(:search))`, {
        search: `%${search}%`,
      });
  }
}
