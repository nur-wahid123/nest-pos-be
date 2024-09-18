import { Injectable } from "@nestjs/common";
import { PurchaseItem } from "src/entities/purchase-item.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class PurchaseItemRepository extends Repository<PurchaseItem> {
    constructor(private readonly dataSource: DataSource) {
        super(PurchaseItem, dataSource.createEntityManager())
    }
}