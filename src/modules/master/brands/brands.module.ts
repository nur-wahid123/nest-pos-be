import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandRepository } from 'src/repositories/brand.repository';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, BrandRepository],
})
export class BrandsModule { }
