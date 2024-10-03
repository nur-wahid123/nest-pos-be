import { Body, Controller, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post('create')
  create(@Body() createSaleDto: CreateSaleDto, @Payload() payload: JwtPayload) {
    return this.salesService.create(createSaleDto, +payload.sub)
  }

}
