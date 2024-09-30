import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { codeFormater } from "src/common/utils/auto-generate-code.util";
import { autoGenerateCodeBank } from "src/common/utils/multi-payment-process.util";
import { Payment } from "src/entities/payment.entity";
import { PurchaseItem } from "src/entities/purchase-item.entity";
import { Purchase } from "src/entities/purchase.entity";
import { Supplier } from "src/entities/supplier.entity";
import { CreatePurchaseDto } from "src/modules/purchases/dto/create-purchase.dto";
import { QueryPurchaseDateRangeDto } from "src/modules/purchases/dto/query-purchase-date-range.dto";
import { QueryPurchaseListDto } from "src/modules/purchases/dto/query-purchase-list.dto";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class PurchaseRepository extends Repository<Purchase> {
    constructor(private readonly dataSource: DataSource) {
        super(Purchase, dataSource.createEntityManager())
    }

    async autoGenerateCode(date: Date): Promise<string> {
        const newDate = new Date(date).toDateString();
        const lastRecord = await this.dataSource
            .createQueryBuilder(Purchase, 'purchase')
            .where('purchase.date = :date', { date: newDate })
            .orderBy('purchase.createdAt', 'DESC')
            .getOne();
        return await codeFormater(
            'ET',
            'PB',
            date,
            lastRecord ? lastRecord.code : null,
        );
    }

    async createPurchase(
        code: string,
        parent: Omit<CreatePurchaseDto, 'purchaseItems'>,
        child: PurchaseItem[],
        supplier: Supplier,
        total: number,
        userId: number,
    ): Promise<Purchase> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchase = new Purchase();
            purchase.note = parent?.note;
            purchase.date = parent.date;
            purchase.code = code;
            purchase.createdBy = userId;
            purchase.total = total;
            purchase.supplier = supplier;
            await queryRunner.manager.save(purchase);
            const purchaseItems = this.createChild(purchase, child, userId);
            await queryRunner.manager.save(purchaseItems);
            await queryRunner.commitTransaction();

            return purchase

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
        timeRange?: QueryPurchaseDateRangeDto,
        queryparam?: QueryPurchaseListDto,
    ) {
        const { code, supplier, search } = queryparam;

        const query = this.dataSource
            .createQueryBuilder(Purchase, 'purchase')
            .leftJoinAndSelect('purchase.supplier', 'supplier')
            .leftJoinAndSelect('purchase.payments', 'payments')
        query.where((qb) => {
            search &&
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
            code &&
                qb.andWhere(`(lower(purchase.code) like lower(:code) )`, {
                    code: `%${code}%`,
                });
            supplier &&
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
        if (pageOptionsDto) {
            this.applyPageOptions(
                query,
                pageOptionsDto,
                'purchase.date',
                'purchase.id',
            );
        }
        return query;
    }

    private applyTimeRange(
        query: SelectQueryBuilder<Purchase>,
        timeRange: QueryPurchaseDateRangeDto,
    ) {
        const { startDate, finishDate } = timeRange;

        startDate && query.andWhere('purchase.date >= :startDate', { startDate });
        finishDate &&
            query.andWhere('purchase.date <= :finishDate', { finishDate });
    }

    private applyPageOptions(
        query: SelectQueryBuilder<Purchase>,
        pageOptionsDto: PageOptionsDto,
        orderColumn: string,
        orderColumn2?: string,
    ) {
        const { order, skip, take } = pageOptionsDto;
        if (order) {
            orderColumn && query.orderBy(orderColumn, order);
            orderColumn2 && query.addOrderBy(orderColumn2, order);
        }
        skip && query.offset(skip);
        take && query.limit(take);
    }

}