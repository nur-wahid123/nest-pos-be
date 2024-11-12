import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from 'src/repositories/city.repository';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from 'src/entities/city.entity';
import { ProvinceRepository } from 'src/repositories/province.repository';
import { InitCityDto } from './dto/init-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async init() {
    const city = await this.cityRepository.find();
    if (city.length > 0) {
      return city;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const indonesia = require('indonesia-cities-regencies');
    const cities: InitCityDto[] = indonesia.getAll();
    return this.cityRepository.initCreate(cities);
  }

  findAll() {
    return this.cityRepository.find({ take: 10 });
  }

  async create(createDto: CreateCityDto, userId: number) {
    const { name, capital, provinceId } = createDto;
    const checkExistance = await this.cityRepository.findOne({
      where: {
        name: name,
      },
    });
    if (checkExistance) {
      throw new BadRequestException(
        'The Cities is exist with name : ' + checkExistance.name,
      );
    }
    const province = await this.provinceRepository.findOneBy({
      id: provinceId,
    });
    if (!province) throw new NotFoundException('province not found');
    const checkDeleted = await this.cityRepository.findOne({
      where: {
        name: name,
      },
      withDeleted: true,
    });

    if (checkDeleted) {
      checkDeleted.deletedAt = null;
      checkDeleted.deletedBy = null;
      checkDeleted.updatedBy = userId;
      checkDeleted.capital = capital;
      checkDeleted.province = province;
      return this.cityRepository.save(checkDeleted);
    }
    const newCity = new City();
    newCity.name = name;
    newCity.capital = capital;
    newCity.province = province;
    newCity.createdBy = userId;
    return this.cityRepository.save(newCity);
  }
}
