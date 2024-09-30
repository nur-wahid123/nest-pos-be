import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { CityRepository } from 'src/repositories/city.repository';
import { City } from 'src/entities/city.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Injectable()
export class SupplierService {

  constructor(private readonly supplierRepository: SupplierRepository, private readonly cityRepository: CityRepository) { }

  async create(createSupplierDto: CreateSupplierDto, userId: number): Promise<Supplier> {
    //generate code
    const code = await this.supplierRepository.autoGenerateCode();

    //check city
    let city: City;
    if (createSupplierDto.city) {
      city = await this.cityRepository.findOneBy({ id: createSupplierDto.city });
      if (!city) throw new BadRequestException(['city not found']);
    }

    return await this.supplierRepository.createSupplier(
      code,
      createSupplierDto,
      city,
      userId,
    );
  }

  findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({ relations: { city: true } });
  }

  findOne(id: number): Promise<Supplier> {
    return this.supplierRepository.findOne({ where: { id }, relations: { city: true } });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto, userId: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: { city: true } })
    if (!supplier) throw new NotFoundException('Supplier Not Found')
    supplier.address = updateSupplierDto.address;
    supplier.email = updateSupplierDto.email;
    supplier.name = updateSupplierDto.name;
    supplier.phone = updateSupplierDto.phone;
    if (updateSupplierDto.city) {
      const city = await this.cityRepository.findOneBy({ id })
      supplier.city = city;
    }
    supplier.updatedBy = userId
    return this.supplierRepository.save(supplier);
  }

  async remove(id: number, userId: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } })
    if (!supplier) throw new NotFoundException('Supplier Not Found')
    supplier.deletedBy = userId
    this.supplierRepository.save(supplier)
    return this.supplierRepository.softDelete(id);
  }
}
