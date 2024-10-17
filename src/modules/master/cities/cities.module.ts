import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { CityRepository } from 'src/repositories/city.repository';
import { ProvinceRepository } from 'src/repositories/province.repository';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, CityRepository, ProvinceRepository],
})
export class CitiesModule {}
