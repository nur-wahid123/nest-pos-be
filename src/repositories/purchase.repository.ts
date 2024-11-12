import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { codeFormater } from 'src/common/utils/auto-generate-code.util';
import { Merchant } from 'src/entities/merchant.entity';
import { PurchaseItem } from 'src/entities/purchase-item.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { CreatePurchaseDto } from 'src/modules/purchases/dto/create-purchase.dto';
import { QueryDateRangeDto } from 'src/common/dto/query-purchase-date-range.dto';
import { QueryPurchaseListDto } from 'src/modules/purchases/dto/query-purchase-list.dto';
import {
  DataSource,
  Repository,
  SelectQueryBuilder,
  QueryRunner,
} from 'typeorm';

@Injectable()
export class PurchaseRepository extends Repository<Purchase> {
  constructor(private readonly dataSource: DataSource) {
    super(Purchase, dataSource.createEntityManager());
  }

  async autoGenerateCode(
    queryRunner: QueryRunner,
    date: Date,
  ): Promise<string> {
    const newDate = new Date(date).toDateString();
    const lastRecord = await queryRunner.manager
      .createQueryBuilder(Purchase, 'purchase')
      .where('purchase.date = :date', { date: newDate })
      .orderBy('purchase.createdAt', 'DESC')
      .setLock('pessimistic_write')
      .getOne();
    return await codeFormater(
      'ET',
      'PB',
      date,
      lastRecord ? lastRecord.code : null,
    );
  }

  async createPurchase(
    parent: Omit<CreatePurchaseDto, 'purchaseItems'>,
    child: PurchaseItem[],
    supplier: Supplier,
    total: number,
    userId: number,
    merchantId: number,
  ): Promise<Purchase> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const merchant = await queryRunner.manager.findOne(Merchant, {
      where: { id: merchantId },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');
    const code = await this.autoGenerateCode(queryRunner, parent.date);
    try {
      const purchase = new Purchase();
      purchase.note = parent?.note;
      purchase.date = parent.date;
      purchase.code = code;
      purchase.createdBy = userId;
      purchase.total = total;
      purchase.supplier = supplier;
      purchase.merchant = merchant;
      await queryRunner.manager.save(purchase);
      const purchaseItems = this.createChild(purchase, child, userId);
      await queryRunner.manager.save(purchaseItems);
      await queryRunner.commitTransaction();

      return purchase;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  private createChild(
    parent: Purchase,
    child: PurchaseItem[],
    userId: number,
  ): PurchaseItem[] {
    return child.map((data: PurchaseItem) => {
      const purchaseItem = new PurchaseItem();
      Object.assign(purchaseItem, data);
      purchaseItem.purchase = parent;
      purchaseItem.createdBy = userId;
      return purchaseItem;
    });
  }

  findAll(
    pageOptionsDto: PageOptionsDto,
    timeRange?: QueryDateRangeDto,
    queryparam?: QueryPurchaseListDto,
  ) {
    const { code, supplier, search } = queryparam;
    const { take, page, skip, order } = pageOptionsDto;
    const query = this.dataSource
      .createQueryBuilder(Purchase, 'purchase')
      .leftJoinAndSelect('purchase.supplier', 'supplier')
      .leftJoinAndSelect('purchase.payments', 'payments')
      .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItems')
      .leftJoinAndSelect('purchaseItems.product', 'product');
    query.where((qb) => {
      if (search)
        qb.andWhere(
          `(
              lower(purchase.code) like lower(:search) OR 
              lower(supplier.name) like lower(:search) 
            )`
            .replace(/\s+/g, ' ')
            .trim(),
          {
            search: `%${search}%`,
          },
        );
      if (code)
        qb.andWhere(`(lower(purchase.code) like lower(:code) )`, {
          code: `%${code}%`,
        });
      if (supplier)
        qb.andWhere(
          `(lower(supplier.code) like lower(:supplier) OR lower(supplier.name)  like lower(:supplier))`,
          {
            supplier: `%${supplier}%`,
          },
        );
      if (timeRange) {
        this.applyTimeRange(qb, timeRange);
      }
    });
    if (page && skip) {
      query.take(take);
      query.skip(skip);
    }
    if (order) {
      query.orderBy('purchase.createdAt', order);
    } else {
      query.orderBy('purchase.createdAt', 'DESC');
    }
    return query;
  }

  private applyTimeRange(
    query: SelectQueryBuilder<Purchase>,
    timeRange: QueryDateRangeDto,
  ) {
    const { startDate, finishDate } = timeRange;

    if (startDate) query.andWhere('purchase.date >= :startDate', { startDate });
    if (finishDate)
      query.andWhere('purchase.date <= :finishDate', { finishDate });
  }
}
