import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { codeFormater } from 'src/common/utils/auto-generate-code.util';
import { City } from 'src/entities/city.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { CreateSupplierDto } from 'src/modules/master/supplier/dto/create-supplier.dto';
import { UpdateSupplierDto } from 'src/modules/master/supplier/dto/update-supplier.dto';
import { DataSource, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
  constructor(private dataSource: DataSource) {
    super(Supplier, dataSource.createEntityManager());
  }

  async batchCreate(suppliers: Supplier[]): Promise<Supplier[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.save(suppliers, { chunk: 1000 });
      await queryRunner.commitTransaction();
      return suppliers;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async autoGenerateCode(queryRunner: QueryRunner): Promise<string> {
    const newDate = new Date();
    const lastRecord = await queryRunner.manager
      .createQueryBuilder(Supplier, 'supplier')
      .where(`EXTRACT(YEAR FROM supplier.createdAt) = :year`, {
        year: newDate.getFullYear(),
      })
      .andWhere('supplier.code like :pref', {
        pref: 'ET/SP%',
      })
      .orderBy('supplier.code', 'DESC')
      .setLock('pessimistic_write')
      .getOne();
    return await codeFormater(
      'ET',
      'SP',
      newDate,
      lastRecord ? lastRecord.code : null,
    );
  }

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
    city: City,
    userId: number,
  ): Promise<Supplier> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      const code = await this.autoGenerateCode(queryRunner);
      const newSupplier = new Supplier();
      const splr = Object.assign(newSupplier, createSupplierDto);
      splr.code = code;
      splr.createdBy = userId;
      splr.city = city;
      await queryRunner.manager.save(splr);
      await queryRunner.commitTransaction();
      return splr;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Internal Server Error");
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const { take, skip, order } = pageOptionsDto
    const query = this.dataSource.createQueryBuilder(Supplier, 'supplier')
      .where((qb) => {
        this.applyFilters(qb, filter);
      });
    order &&
      query.orderBy('supplier.name', order);
    take && query.limit(take);
    skip && query.offset(skip);
    return await query.getManyAndCount();
  }

  private applyFilters(qb: SelectQueryBuilder<Supplier>, query: FilterDto) {
    const { code, search } = query;
    code &&
      qb.andWhere(`(lower(supplier.code) like lower(:code) )`, {
        code: `%${code}%`,
      });
    search &&
      qb.andWhere(`(lower(supplier.name) like lower(:search) )`, {
        search: `%${search}%`,
      });
  }

  findById(id: number): Promise<Supplier> {
    const ett = this.dataSource.createEntityManager();
    return ett.findOne(Supplier, {
      relations: { city: true },
      where: { id },
    });
  }

  async updateSuplier(supplier: Supplier): Promise<Supplier> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.save(supplier);
      await queryRunner.commitTransaction();
      return supplier;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
