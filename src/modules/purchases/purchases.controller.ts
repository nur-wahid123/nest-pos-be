import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { QueryPurchaseListDto } from './dto/query-purchase-list.dto';
import { QueryPurchaseDateRangeDto } from './dto/query-purchase-date-range.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService
  ) {
  }

  @Post('create')
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.purchasesService.create(createPurchaseDto, payload.sub);
  }

  @Post('payment')
  payment(
    @Payload() payload: JwtPayload,
    @Body() paymentDto: CreatePaymentDto
  ) {
    return this.purchasesService.createPayment(paymentDto, payload?.sub)
  }

  @Get('need-to-pay')
  needToPay(@Query() param: { purchase_code: string }) {
    return this.purchasesService.needToPay(param.purchase_code)
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
