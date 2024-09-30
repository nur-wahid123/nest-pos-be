import { Injectable } from "@nestjs/common";
import { Purchase } from "src/entities/purchase.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class PurchaseRepository extends Repository<Purchase> {
    constructor(private readonly dataSource: DataSource) {
        super(Purchase, dataSource.createEntityManager())
    }
}