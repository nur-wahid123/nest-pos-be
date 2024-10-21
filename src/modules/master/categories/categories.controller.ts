<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
>>>>>>> master
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
<<<<<<< HEAD
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { QueryListDto } from './dto/query-list.dto';
=======
>>>>>>> master

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Payload() payload: JwtPayload) {
    return this.categoriesService.create(createCategoryDto, payload.sub);
  }

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.categoriesService.findAll(query);
  }
  @Get('cashier')
  findInCashier(@Query() query: QueryListDto) {
    return this.categoriesService.findAll(query, true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Payload() payload: JwtPayload) {
    return this.categoriesService.update(+id, updateCategoryDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.categoriesService.remove(+id, payload.sub);
  }
}
