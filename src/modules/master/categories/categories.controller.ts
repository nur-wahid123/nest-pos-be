import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Payload() payload: JwtPayload) {
    return this.categoriesService.create(createCategoryDto, payload.sub);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
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
