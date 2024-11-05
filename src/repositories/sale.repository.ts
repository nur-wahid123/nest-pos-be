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

  private aplyFilters(qb: SelectQueryBuilder<Sale>, query: QuerySaleDto) {
    const { saleCode, search } = query;
    saleCode && qb.andWhere('sale.code = :saleCode', { saleCode });
    search &&
      qb.andWhere('lower(sale.code) like lower(:search)', {
        search: `%${search}%`,
      });
  }

  private checkStock(saleItems: SaleItem[], manager: EntityManager) {
    let correct = true;
    saleItems.map(async (v) => {
      let inventory = await manager.findOne(Inventory, {
        where: { product: { id: v?.product.id } },
      });
      console.log(inventory, v);

      if (!inventory || inventory.qty < v?.qty) correct = false;
    });
    return correct;
  }

  async autoGenerateCode(
    queryRunner: QueryRunner,
    date: Date,
  ): Promise<string> {
    const newDate = new Date(date).toDateString();
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
    const isCorrect = this.checkStock(child, queryRunner.manager);
    if (!isCorrect) throw new BadRequestException('Stock not enough');
    const code = await this.autoGenerateCode(queryRunner, parent.date);

    try {
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
      throw new InternalServerErrorException();
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
