import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @Payload() payload: JwtPayload) {
    return this.brandsService.create(createBrandDto, payload.sub);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto, @Payload() payload: JwtPayload) {
    return this.brandsService.update(+id, updateBrandDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.brandsService.remove(+id, payload.sub);
  }
}
