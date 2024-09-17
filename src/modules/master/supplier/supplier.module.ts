import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { CityRepository } from 'src/repositories/city.repository';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository, CityRepository],
})
export class SupplierModule { }
