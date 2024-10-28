import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomDto } from './dto/update-uom.dto';
import { UomRepository } from 'src/repositories/uom.repository';
import { Uom } from 'src/entities/uom.entity';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class UomsService {
  constructor(private readonly uomRepository: UomRepository) {}

  async init() {
    const uom = [
      {
        name: 'pcs',
        description: 'Pieces',
      },
      {
        name: 'unit',
        description: 'Unit',
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

  async create(createUomDto: CreateUomDto, userId: number): Promise<Uom> {
    const uomsName = await this.uomRepository.findOneBy({
      name: createUomDto.name,
    });
    if (uomsName) {
      throw new BadRequestException(`Unit is Exist name : ${uomsName.name}`);
    }
    const uomsDesc = await this.uomRepository.findOneBy({
      description: createUomDto.description,
    });
    if (uomsDesc) {
      throw new BadRequestException(
        `Description is Exist with name : ${uomsDesc.name}`,
      );
    }
    const uomDeleted = await this.uomRepository.findOne({
      where: { name: createUomDto.name },
      withDeleted: true,
    });
    if (uomDeleted) {
      uomDeleted.deletedAt = null;
      uomDeleted.deletedBy = null;
      uomDeleted.description = createUomDto.description;
      uomDeleted.updatedBy = userId;
      return this.uomRepository.save(uomDeleted);
    }
    const newUom = new Uom();
    newUom.name = createUomDto.name;
    newUom.description = createUomDto.description;
    newUom.createdBy = userId;
    return this.uomRepository.save(newUom);
  }

  async findAll(query:FilterDto, pageOptionsDto:PageOptionsDto) {
    const [data,itemCount] = await this.uomRepository.findUoms(query,pageOptionsDto);
     
    const pageMetaDto = new PageMetaDto({pageOptionsDto,itemCount})
    return new PageDto(data,pageMetaDto)
  }

  findOne(id: number) {
    return `This action returns a #${id} uom`;
  }

  async update(updateUomDto: UpdateUomDto, userId: number) {
    const uomsName = await this.uomRepository.findOneBy({
      name: updateUomDto.beforeName,
    });
    if (!uomsName) {
      throw new BadRequestException(`Unit does not exist`);
    }
    uomsName.name = updateUomDto.name;
    uomsName.description = updateUomDto.description;
    uomsName.updatedBy = userId;
    return await this.uomRepository.save(uomsName);
  }

  async remove(id: number, userId: number) {
    const uom = await this.uomRepository.findOne({ where: { id } });
    if (uom) {
      uom.deletedBy = userId;
      return await this.uomRepository.softDelete(uom);
    }
    throw new BadRequestException('Unit does not exists');
  }
}
