import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.supplierService.create(createSupplierDto, payload.sub);
  }

  @Get('list')
  findAll(@Query() filter: FilterDto, @Query() pageOptionsDto: PageOptionsDto) {
    return this.supplierService.findAll(filter, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.supplierService.update(+id, updateSupplierDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.supplierService.remove(+id, payload.sub);
  }
}
