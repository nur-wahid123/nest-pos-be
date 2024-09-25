import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { QueryPurchaseListDto } from './dto/query-purchase-list.dto';
import { QueryPurchaseDateRangeDto } from './dto/query-purchase-date-range.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll()
  }

  @Post('create')
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.purchasesService.create(createPurchaseDto, payload.sub);
  }

  @Get()
  find(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() timeRange: QueryPurchaseDateRangeDto,
    @Query() query: QueryPurchaseListDto,
  ) {
    return this.purchasesService.find(pageOptionsDto, timeRange, query)
  }
}
