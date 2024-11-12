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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { QueryListDto } from './dto/query-list.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.categoriesService.create(createCategoryDto, payload.sub);
  }

  @Get('list')
  findAll(
    @Query() query: QueryListDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.categoriesService.findAll(query, pageOptionsDto);
  }
  @Get('cashier')
  findInCashier(@Query() query: QueryListDto) {
    return this.categoriesService.findCasheer(query);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.categoriesService.remove(+id, payload.sub);
  }
}
