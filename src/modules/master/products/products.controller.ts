import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { Product } from 'src/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Payload() payload: JwtPayload): Promise<Product> {
    return this.productsService.create(createProductDto, payload.sub);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Payload() payload: JwtPayload) {
    return this.productsService.update(+id, updateProductDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.productsService.remove(+id, payload.sub);
  }
}
