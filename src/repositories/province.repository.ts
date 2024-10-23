import { Injectable } from '@nestjs/common';
import { Province } from 'src/entities/province.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProvinceRepository extends Repository<Province> {
  constructor(private readonly dataSource: DataSource) {
    super(Province, dataSource.manager);
  }
}
