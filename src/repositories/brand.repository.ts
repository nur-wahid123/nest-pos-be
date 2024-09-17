import { Injectable } from "@nestjs/common";
import Brand from "src/entities/brand.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BrandRepository extends Repository<Brand> {
    constructor(private readonly datasource: DataSource) {
        super(Brand, datasource.createEntityManager())
    }
}