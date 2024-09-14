import { Injectable } from '@nestjs/common';
import { CreateUomInput } from './dto/create-uom.input';
import { UpdateUomInput } from './dto/update-uom.input';
import { UomRepository } from 'src/repositories/uom.repository';
import { Uom } from 'src/entities/uom.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UomsService {
  constructor(private readonly uomRepository: UomRepository) { }

  async init() {
    const uom = [
      {
        name: 'pieces',
      },
      {
        name: 'unit',
      },
    ];
    if ((await this.uomRepository.find()).length < 1) {
      this.uomRepository
        .createQueryBuilder()
        .insert()
        .into(Uom)
        .values(uom)
        .execute();
    }
    console.log('uoms created!!');
  }

  create(createUomInput: CreateUomInput) {
    return 'This action adds a new uom';
  }

  findAll() {
    return this.uomRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} uom`;
  }

  update(id: number, updateUomInput: UpdateUomInput) {
    return `This action updates a #${id} uom`;
  }

  remove(id: number) {
    return `This action removes a #${id} uom`;
  }
}
