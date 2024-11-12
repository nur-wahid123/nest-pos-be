import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { QueryDateRangeDto } from 'src/common/dto/query-purchase-date-range.dto';
import { codeFormater } from 'src/common/utils/auto-generate-code.util';
import { Inventory } from 'src/entities/inventory.entity';
import SaleItem from 'src/entities/sale-item.entity';
import { Sale } from 'src/entities/sale.entity';
import { CreateSaleDto } from 'src/modules/sales/dto/create-sale.dto';
import { QuerySaleDto } from 'src/modules/sales/dto/query-sale.dto';
import {
  DataSource,
  EntityManager,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class SaleRepository extends Repository<Sale> {
  constructor(private readonly dataSource: DataSource) {
    super(Sale, dataSource.createEntityManager());
  }

  async findSales(
    filter: QuerySaleDto,
    dateRange: QueryDateRangeDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const { finishDate, startDate } = dateRange;
    const { page, order, take, skip } = pageOptionsDto;
    const query = this.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('saleItems.product', 'product')
      .leftJoinAndSelect('sale.payments', 'payments')
      .where((qb) => {
        this.aplyFilters(qb, filter);
        if (startDate && finishDate) {
          qb.andWhere(
            `DATE(sale.createdAt) between :startDate and :finishDate`,
            { startDate, finishDate },
          );
        }
      })
      .orderBy('sale.createdAt', 'DESC');
    if (page && take) {
      query.skip(skip).take(take);
    }
    if (order) {
      query.orderBy('sale.createdAt', order);
    } else {
      query.orderBy('sale.createdAt', 'DESC');
    }

    return await query.getManyAndCount();
  }

  async detailSale(id: number) {
    const sale = await this.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('saleItems.product', 'product')
      .leftJoinAndSelect('sale.payments', 'payments')
      .leftJoinAndSelect('product.uom', 'uom')
      .where('sale.id = :id', { id })
      .getOne();
    return sale;
  }

  private aplyFilters(qb: SelectQueryBuilder<Sale>, query: QuerySaleDto) {
    const { saleCode, search } = query;
    if (saleCode) qb.andWhere('sale.code = :saleCode', { saleCode });
    if (search)
      qb.andWhere('lower(sale.code) like lower(:search)', {
        search: `%${search}%`,
      });
  }

  async initBuyPrice0() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const saleItems = await queryRunner.manager.find(SaleItem, {
        relations: { product: true },
        select: {
          id: true,
          buyPrice: true,
          product: { id: true, buyPrice: true },
        },
      });
      console.log('oi');
      saleItems.map(async (v) => {
        console.log(v);
        if (Number(v.buyPrice) === 0) {
          v.buyPrice = Number(v.product.buyPrice);
          await queryRunner.manager.save(v);
        }
      });
      await queryRunner.commitTransaction();
      return saleItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('internal server error');
    } finally {
      await queryRunner.release();
    }
  }
  async initBuyPrice() {
    return 'hello ';
  }

  async getInformation(filter: QuerySaleDto, dateRange: QueryDateRangeDto) {
    const { startDate, finishDate } = dateRange;
    const query = this.dataSource
      .createQueryBuilder(Sale, 'sale')
      .leftJoin('sale.saleItems', 'saleItems')
      .leftJoin('saleItems.product', 'product')
      .select('count(distinct(sale.id)) as all_sale')
      .addSelect('sum(sale.total) as total')
      .addSelect(
        'SUM(sale.total) - SUM(saleItems.buyPrice * saleItems.qty)',
        'total_returns',
      )
      .where((qb) => {
        this.aplyFilters(qb, filter);
        if (startDate && finishDate) {
          qb.andWhere(
            `DATE(sale.createdAt) between :startDate and :finishDate`,
            { startDate, finishDate },
          );
        }
      });
    return await query.getRawOne();
  }

  private checkStock(saleItems: SaleItem[], manager: EntityManager) {
    let correct = true;
    saleItems.map(async (v) => {
      const inventory = await manager.findOne(Inventory, {
        where: { product: { id: v?.product.id } },
      });

      if (!inventory || inventory.qty < v?.qty) correct = false;
    });
    return correct;
  }

  async autoGenerateCode(
    queryRunner: QueryRunner,
    date: Date,
  ): Promise<string> {
    const newDate = new Date(date).toISOString();
    const lastRecord = await queryRunner.manager
      .createQueryBuilder(Sale, 'sale')
      .where('sale.date = :date', { date: newDate })
      .orderBy('sale.createdAt', 'DESC')
      .setLock('pessimistic_write')
      .getOne();
    return await codeFormater(
      'ET',
      'PJ',
      date,
      lastRecord ? lastRecord.code : null,
    );
  }

  async createSale(
    parent: Omit<CreateSaleDto, 'saleItems'>,
    child: SaleItem[],
    total: number,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isCorrect = this.checkStock(child, queryRunner.manager);
      if (!isCorrect) throw new BadRequestException('Stock not enough');
      const code = await this.autoGenerateCode(queryRunner, parent.date);
      const sale = new Sale();
      sale.note = parent?.note;
      sale.date = parent.date;
      sale.code = code;
      sale.createdBy = userId;
      sale.total = total;
      sale.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await queryRunner.manager.save(sale);
      const saleItems = this.createChild(sale, child, userId);
      await queryRunner.manager.save(saleItems);
      await queryRunner.commitTransaction();

      return sale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private createChild(
    parent: Sale,
    child: SaleItem[],
    userId: number,
  ): SaleItem[] {
    return child.map((data: SaleItem) => {
      const purchaseItem = new SaleItem();
      Object.assign(purchaseItem, data);
      purchaseItem.sale = parent;
      purchaseItem.createdBy = userId;
      return purchaseItem;
    });
  }
}
