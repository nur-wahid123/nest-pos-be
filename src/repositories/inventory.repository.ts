import { Injectable } from "@nestjs/common";
import { FilterDto } from "src/common/dto/filter.dto";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { Inventory } from "src/entities/inventory.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class InventoryRepository extends Repository<Inventory> {
    constructor(private readonly dataSource: DataSource) {
        super(Inventory, dataSource.manager);
    }

    async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
        const { take, skip, order } = pageOptionsDto;
        const query = this.dataSource
            .createQueryBuilder(Inventory, 'inventory')
            .leftJoin('inventory.product', 'product')
            .leftJoin('product.uom', 'uom')
            .leftJoin('product.brand', 'brand')
            .leftJoin('product.category', 'category')
            .leftJoin('inventory.inventoryLedgers', 'inventoryLedgers')
            .where((qb) => {
                this.applyFilters(qb, filter);
            })
            .orderBy('inventory.name', order);
        take && query.limit(take);
        skip && query.offset(skip);
        return await query.getManyAndCount();
    }

    applyFilters(qb: any, filter: FilterDto) {
        const { code, search } = filter;
        code && qb.andWhere(`(lower(product.code) like lower(:code))`, {
            code: `%${code}%`,
        });
        search && qb.andWhere(`(lower(product.name) like lower(:search))`, {
            search: `%${search}%`,
        });
    }
}