import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { codeFormater } from "src/common/utils/auto-generate-code.util";
import { Inventory } from "src/entities/inventory.entity";
import SaleItem from "src/entities/sale-item.entity";
import { Sale } from "src/entities/sale.entity";
import { CreateSaleDto } from "src/modules/sales/dto/create-sale.dto";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class SaleRepository extends Repository<Sale> {
    constructor(private readonly dataSource: DataSource) {
        super(Sale, dataSource.createEntityManager())
    }

    private checkStock(saleItems: SaleItem[], manager: EntityManager) {
        let correct = true
        saleItems.map(async (v) => {
            let inventory = await manager.findOne(Inventory, { where: { product: { id: v?.product.id } } })
            console.log(inventory, v);

            if (!inventory || inventory.qty < v?.qty) correct = false
        })
        return correct
    }

    async autoGenerateCode(date: Date): Promise<string> {
        const newDate = new Date(date).toDateString();
        const lastRecord = await this.dataSource
            .createQueryBuilder(Sale, 'sale')
            .where('sale.date = :date', { date: newDate })
            .orderBy('sale.createdAt', 'DESC')
            .getOne();
        return await codeFormater(
            'ET',
            'PJ',
            date,
            lastRecord ? lastRecord.code : null,
        );
    }

    async createSale(
        code: string,
        parent: Omit<CreateSaleDto, 'saleItems'>,
        child: SaleItem[],
        total: number,
        userId: number
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const isCorrect = this.checkStock(child, queryRunner.manager)
        if (!isCorrect) throw new BadRequestException('Stock not enough')
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

            return sale

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