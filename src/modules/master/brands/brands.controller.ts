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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post('create')
  create(
    @Body() createBrandDto: CreateBrandDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.brandsService.create(createBrandDto, payload.sub);
  }

  @Get('list')
  findAll(@Query() query: FilterDto, @Query() pageOptionsDto: PageOptionsDto) {
    return this.brandsService.findAll(query, pageOptionsDto);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.brandsService.update(+id, updateBrandDto, payload.sub);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.brandsService.remove(+id, payload.sub);
  }
}
