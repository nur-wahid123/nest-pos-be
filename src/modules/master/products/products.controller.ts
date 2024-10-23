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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { Product } from 'src/entities/product.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { QueryListDto } from '../categories/dto/query-list.dto';
import { QueryProductListDto } from './dto/query-product-list.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Payload() payload: JwtPayload,
  ): Promise<Product> {
    return this.productsService.create(createProductDto, payload.sub);
  }

  @Get('all')
  findAll(
    @Query() query: QueryProductListDto,
    @Query() pageOptions: PageOptionsDto,
  ) {
    return this.productsService.findAll(query, pageOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('init/add')
  init() {
    console.log('hello');

    return this.productsService.init();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.productsService.update(+id, updateProductDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.productsService.remove(+id, payload.sub);
  }
}
