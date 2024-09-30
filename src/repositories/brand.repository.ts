import { Injectable, InternalServerErrorException } from "@nestjs/common";
import Brand from "src/entities/brand.entity";
import { CreateBrandDto } from "src/modules/master/brands/dto/create-brand.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BrandRepository extends Repository<Brand> {
    constructor(private readonly datasource: DataSource) {
        super(Brand, datasource.createEntityManager())
    }

    async createBrand(createBrandDto: CreateBrandDto, userId: number): Promise<Brand> {
        console.log(userId);

        const queryRunner = this.datasource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const brand = await queryRunner.manager.save(Brand, { ...createBrandDto, createdBy: userId })
            await queryRunner.commitTransaction()
            return brand
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('eror')
        } finally {
            await queryRunner.release()
        }
    }
}