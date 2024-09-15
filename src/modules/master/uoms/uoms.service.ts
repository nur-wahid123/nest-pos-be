import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomInput } from './dto/update-uom.dto';
import { UomRepository } from 'src/repositories/uom.repository';
import { Uom } from 'src/entities/uom.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UomsService {
  constructor(private readonly uomRepository: UomRepository) { }

  async init() {
    const uom = [
      {
        name: 'pcs',
        description: 'Pieces'
      },
      {
        name: 'unit',
        description: "Unit"
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

  async create(createUomDto: CreateUomDto) {

    const uomsName = await this.uomRepository.findOneBy({ name: createUomDto.name })
    if (uomsName) {
      throw new BadRequestException(`Unit is Exist name : ${uomsName.name}`)
    }
    const uomsDesc = await this.uomRepository.findOneBy({ description: createUomDto.description })
    console.log(uomsDesc);
    if (uomsDesc) {
      throw new BadRequestException(`Description is Exist with name : ${uomsDesc.name}`)
    }
    this.uomRepository
      .createQueryBuilder()
      .insert()
      .into(Uom)
      .values(createUomDto)
      .execute();
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
