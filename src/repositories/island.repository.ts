import { Injectable } from '@nestjs/common';
import { Island } from 'src/entities/island.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class IslandRepository extends Repository<Island> {
  constructor(private readonly dataSource: DataSource) {
    super(Island, dataSource.manager);
  }
}
