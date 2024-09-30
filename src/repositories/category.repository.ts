import { Injectable } from "@nestjs/common";
import { codeFormater } from "src/common/utils/auto-generate-code.util";
import Category from "src/entities/category.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(private readonly dataSource: DataSource) {
        super(Category, dataSource.createEntityManager())
    }

    async autoGenerateCode(): Promise<string> {
        const newDate = new Date();
        const lastRecord = await this.dataSource
            .createQueryBuilder(Category, 'category')
            .where(`EXTRACT(YEAR FROM category.createdAt) = :year`, {
                year: newDate.getFullYear(),
            })
            .andWhere('category.code like :pref', {
                pref: 'ET/SP%',
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