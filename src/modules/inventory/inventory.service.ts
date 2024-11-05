import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { InventoryRepository } from 'src/repositories/inventory.repository';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Inventory } from 'src/entities/inventory.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) { }

  create(createInventoryDto: CreateInventoryDto) {
    return 'This action adds a new inventory';
  }

  async findAll(filter: QueryInventoryDto, pageOptionsDto: PageOptionsDto) {
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
    userId:number
  ) {
    const inventory = new Inventory();
    const product = new Product();
    product.id = productId;
    inventory.product = product;
    inventory.qty = updateInventoryDto.qty;
    return this.inventoryRepository.updateInventory(inventory,userId);
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
