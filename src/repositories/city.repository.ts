import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { City } from 'src/entities/city.entity';
import { Island } from 'src/entities/island.entity';
import { Province } from 'src/entities/province.entity';
import { InitCityDto } from 'src/modules/master/cities/dto/init-city.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CityRepository extends Repository<City> {
  constructor(private datasource: DataSource) {
    super(City, datasource.manager);
  }

  async initCreate(cities: InitCityDto[]): Promise<City[]> {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    try {
      const newCities: City[] = [];
      for (let index = 0; index < cities.length; index++) {
        const city = cities[index];
        const { capital, island, name, province } = city;

        let currProvince = await queryRunner.manager.findOne(Province, {
          where: { name: province },
        });
        if (!currProvince) {
          let currIsland = await queryRunner.manager.findOne(Island, {
            where: { name: island },
          });
          if (!currIsland) {
            currIsland = new Island();
            currIsland.name = island;
            await queryRunner.manager.save(currIsland);
          }
          currProvince = new Province();
          currProvince.name = province;
          currProvince.island = currIsland;
          await queryRunner.manager.save(currProvince);
        }
        const newCity = new City();
        newCity.capital = capital;
        newCity.name = name;
        newCity.province = currProvince;
        newCities.push(newCity);
      }

      await queryRunner.startTransaction();
      await queryRunner.manager.save(newCities, { chunk: 1000 });
      await queryRunner.commitTransaction();
      return newCities;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
