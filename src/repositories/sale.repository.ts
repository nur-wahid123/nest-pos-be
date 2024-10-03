import { Injectable } from "@nestjs/common";
import { codeFormater } from "src/common/utils/auto-generate-code.util";
import { Sale } from "src/entities/sale.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SaleRepository extends Repository<Sale> {
    constructor(private readonly dataSource: DataSource) {
        super(Sale, dataSource.createEntityManager())
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
}