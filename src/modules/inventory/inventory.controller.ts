import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FilterDto } from 'src/common/dto/filter.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('create')
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('information')
  inventoryInformation(@Query() query: FilterDto) {
    return this.inventoryService.inventoryInformation(query);
  }

  @Get('list')
  findAll(@Query() query: FilterDto, @Query() pageOptions: PageOptionsDto) {
    return this.inventoryService.findAll(query, pageOptions);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Payload() payoad: JwtPayload,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto, +payoad.sub);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
