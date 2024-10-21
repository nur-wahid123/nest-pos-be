import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { CityRepository } from 'src/repositories/city.repository';
import { City } from 'src/entities/city.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class SupplierService {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly cityRepository: CityRepository,
  ) {}

  async create(
    createSupplierDto: CreateSupplierDto,
    userId: number,
  ): Promise<Supplier> {
    //generate code
    const { cityId } = createSupplierDto;

    //check city
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) throw new BadRequestException(['city not found']);

    return await this.supplierRepository.createSupplier(
      createSupplierDto,
      city,
      userId,
    );
  }

  async findAll(
    filter:FilterDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const [entities, itemCount]= await this.supplierRepository.findAll(filter,pageOptionsDto);

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number): Promise<Supplier> {
    return this.supplierRepository.findOne({
      where: { id },
      relations: { city: true },
    });
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
    userId: number,
  ): Promise<Supplier> {
    const { address, email, name, phone, cityId } = updateSupplierDto;
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { city: true },
    });
    if (!supplier) throw new NotFoundException('Supplier Not Found');
    supplier.address = address;
    supplier.email = email;
    supplier.name = name;
    supplier.phone = phone;
    if (cityId) {
      const city = await this.cityRepository.findOneBy({ id: cityId });
      if (!city) throw new NotFoundException('city not found');
      supplier.city = city;
    }
    supplier.updatedBy = userId;

    return this.supplierRepository.updateSuplier(supplier);
  }

  async remove(id: number, userId: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier Not Found');
    supplier.deletedBy = userId;
    this.supplierRepository.save(supplier);
    return this.supplierRepository.softDelete(id);
  }
}
