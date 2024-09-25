import { Injectable } from "@nestjs/common";
import { codeFormaterWithOutLocation } from "src/common/utils/auto-generate-code.util";
import { Payment } from "src/entities/payment.entity";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class PamentRepository extends Repository<Payment> {
    constructor(private readonly dataSource: DataSource) {
        super(Payment, dataSource.createEntityManager())
    }


}