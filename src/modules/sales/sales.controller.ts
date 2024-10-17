import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalePaymentDto } from './dto/create-payment.dto';
import { Sale } from 'src/entities/sale.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { QuerySaleDto } from './dto/query-sale.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('create')
  create(
    @Body() createSaleDto: CreateSaleDto,
    @Payload() payload: JwtPayload,
  ): Promise<Sale> {
    return this.salesService.create(createSaleDto, +payload.sub);
  }

  @Post('payment')
  payment(
    @Payload() payload: JwtPayload,
    @Body() paymentDto: CreateSalePaymentDto,
  ) {
    return this.salesService.createPayment(paymentDto, payload?.sub);
  }

  @Get('list')
  findAll(@Query() query: QuerySaleDto) {
    return this.salesService.findAll(query);
  }

  @Get('need-to-pay')
  needToPay(@Query() param: { sale_code: string }) {
    return this.salesService.needToPay(param?.sale_code);
  }
}
