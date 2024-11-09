import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { StatusCount } from 'src/common/enums/status-count.enum';
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
            if (page && take) {
            query.skip(skip);
            query.take(take);
        }
        return await query.getManyAndCount();
    }

    async updateInventory(inventory: Inventory, userId: number) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let invt = await queryRunner.manager.findOne(Inventory, {
                where: {
                    product: { id: inventory.product.id },
                },
                lock: { mode: 'pessimistic_write' }
            })
            if (!invt) {
                invt = new Inventory()
                invt.createdBy = userId
            }
            const product = await queryRunner.manager.findOne(Product, {
                where: {
                    id: inventory.product.id
                }
            })
            if (!product) {
                throw new NotFoundException('product not found')
            }
            invt.updatedBy = userId
            invt.qty = inventory.qty
            invt.product = product
            await queryRunner.manager.save(invt)
            await queryRunner.commitTransaction()
            return invt
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error);
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message)
            }
            throw new InternalServerErrorException('internal server error')
        } finally {
            await queryRunner.release()
        }
    }

    applyFilters(qb: any, filter: FilterDto) {
        const { code, search, status } = filter;
        code &&
            qb.andWhere(`(lower(product.code) like lower(:code))`, {
                code: `%${code}%`,
            });
        search &&
            qb.andWhere(`(lower(product.name) like lower(:search) or lower(product.code) like lower(:search))`, {
                search: `%${search}%`,
            });
        if (status) {
            switch (status) {
                case StatusCount.MORE_THAN_ZERO:
                    qb.andWhere('inventory.qty > 0');
                    break;
                case StatusCount.NONE:
                    qb.andWhere(('inventory.qty <= 0 or inventory.qty is null'));
                    break;
                default:
                    break;
            }
        }
    }
}
