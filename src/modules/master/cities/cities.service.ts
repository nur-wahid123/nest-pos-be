import { BadRequestException, Injectable } from '@nestjs/common';
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

    async create(createDto: CreateCityDto, userId: number) {
        const checkExistance = await this.cityRepository.findOne({
            where: {
                name: createDto.name
            }
        })
        if (checkExistance) {
            throw new BadRequestException('The Cities is exist with name : ' + checkExistance.name)
        }
        const checkDeleted = await this.cityRepository.findOne({
            where: {
                name: createDto.name
            }, withDeleted: true
        })
        if (checkDeleted) {
            checkDeleted.deletedAt = null
            checkDeleted.deletedBy = null
            checkDeleted.island = createDto.island
            checkDeleted.capital = createDto.capital
            checkDeleted.province = createDto.province
            return this.cityRepository.save(checkDeleted)
        }
        const newCity = new City()
        newCity.name = createDto.name
        newCity.island = createDto.island
        newCity.capital = createDto.capital
        newCity.province = createDto.province
        newCity.createdBy = userId
        return this.cityRepository.save(newCity)
    }
}
