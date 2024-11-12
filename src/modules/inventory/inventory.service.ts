import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { InventoryRepository } from 'src/repositories/inventory.repository';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Inventory } from 'src/entities/inventory.entity';
import { Product } from 'src/entities/product.entity';
import { FilterDto } from 'src/common/dto/filter.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  create(createInventoryDto: CreateInventoryDto) {
    return createInventoryDto;
  }

  inventoryInformation(filter: FilterDto) {
    return this.inventoryRepository.inventoryInformation(filter);
  }

  async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.inventoryRepository.findAll(
      filter,
      pageOptionsDto,
    );
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, pageMeta);
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(
    productId: number,
    updateInventoryDto: UpdateInventoryDto,
    userId: number,
  ) {
    const inventory = new Inventory();
    const product = new Product();
    product.id = productId;
    inventory.product = product;
    inventory.qty = updateInventoryDto.qty;
    return this.inventoryRepository.updateInventory(inventory, userId);
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
