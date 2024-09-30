import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { codeFormater } from "src/common/utils/auto-generate-code.util";
import { City } from "src/entities/city.entity";
import { Supplier } from "src/entities/supplier.entity";
import { CreateSupplierDto } from "src/modules/master/supplier/dto/create-supplier.dto";
import { UpdateSupplierDto } from "src/modules/master/supplier/dto/update-supplier.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
    constructor(private dataSource: DataSource) {
        super(Supplier, dataSource.createEntityManager())
    }

    async batchCreate(suppliers: Supplier[]): Promise<Supplier[]> {
        const queryRunner = this.dataSource.createQueryRunner()
        queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            await queryRunner.manager.save(suppliers, { chunk: 1000 })
            await queryRunner.commitTransaction()
            return suppliers
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error);
            throw new InternalServerErrorException()
        } finally {
            await queryRunner.release()
        }
    }

    async autoGenerateCode(): Promise<string> {
        const newDate = new Date();
        const lastRecord = await this.dataSource
            .createQueryBuilder(Supplier, 'supplier')
            .where(`EXTRACT(YEAR FROM supplier.createdAt) = :year`, {
                year: newDate.getFullYear(),
            })
            .andWhere('supplier.code like :pref', {
                pref: 'ET/SP%',
            })
            .orderBy('supplier.code', 'DESC')
            .getOne();
        return await codeFormater(
            'ET',
            'SP',
            newDate,
            lastRecord ? lastRecord.code : null,
        );
    }

    async createSupplier(
        code: string,
        createSupplierDto: CreateSupplierDto,
        city: City,
        userId: number,
    ): Promise<Supplier> {
        const ett = this.dataSource.createEntityManager();
        const supplier = ett.create(Supplier, {
            ...createSupplierDto,
            code,
            createdBy: userId,
            city,
        });
        return await ett.save(supplier);
    }

    findById(id: number): Promise<Supplier> {
        const ett = this.dataSource.createEntityManager();
        return ett.findOne(Supplier, {
            relations: { city: true },
            where: { id },
        });
    }

    updateSupplier(id: number, updateDto: UpdateSupplierDto, userId: number) {

    }
}