import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { City } from "src/entities/city.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CityRepository extends Repository<City> {
    constructor(private datasource: DataSource) {
        super(City, datasource.createEntityManager())
    }

    async batchCreate(cities: City[]): Promise<City[]> {
        const queryRunner = this.datasource.createQueryRunner()
        queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            await queryRunner.manager.save(cities, { chunk: 1000 })
            await queryRunner.commitTransaction()
            return cities
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error);
            throw new InternalServerErrorException()
        } finally {
            await queryRunner.release()
        }
    }
}