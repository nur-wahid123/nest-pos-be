import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { Uom } from 'src/entities/uom.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UomRepository extends Repository<Uom> {
  constructor(private dataSource: DataSource) {
    super(Uom, dataSource.manager);
  }

  async findUoms(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const { code, search } = filter;
    const { skip, take } = pageOptionsDto;
    const query = this.dataSource.createQueryBuilder(Uom, 'uom').where((qb) => {
      if (code)
        qb.andWhere(`(lower(uom.code) like lower(:code))`, {
          code: `%${code}%`,
        });
      if (search)
        qb.andWhere(`(lower(uom.name) like lower(:search))`, {
          search: `%${search}%`,
        });
    });
    if (
      skip !== undefined &&
      take &&
      !Number.isNaN(take) &&
      !Number.isNaN(skip)
    ) {
      query.offset(skip).limit(take);
    }
    return await query.getManyAndCount();
  }
}
