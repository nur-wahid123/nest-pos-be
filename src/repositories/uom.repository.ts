import { Injectable } from '@nestjs/common';
import { Uom } from 'src/entities/uom.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UomRepository extends Repository<Uom> {
  constructor(private dataSource: DataSource) {
    super(Uom, dataSource.createEntityManager());
  }
}
