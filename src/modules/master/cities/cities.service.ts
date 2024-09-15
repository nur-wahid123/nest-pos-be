import { Injectable } from '@nestjs/common';
import { CityRepository } from 'src/repositories/city.repository';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from 'src/entities/city.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CitiesService {
    constructor(private readonly cityRepository: CityRepository, private readonly dataSource: DataSource) { }

    init() {
        const indonesia = require('indonesia-cities-regencies')
        const cities: CreateCityDto[] = indonesia.getAll()
        const newCities = cities.map((v) => {
            const nwCt = new City()
            nwCt.capital = v?.capital
            nwCt.province = v?.province
            nwCt.name = v?.name
            nwCt.island = v?.island
            return nwCt
        })
        return this.cityRepository.batchCreate(newCities)
    }

    findAll() {
        return this.cityRepository.find({ take: 10 })
    }
}
