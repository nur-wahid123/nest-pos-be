import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { SaleRepository } from 'src/repositories/sale.repository';
import { ProductRepository } from 'src/repositories/product.repository';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    PaymentRepository,
    SaleRepository,
    ProductRepository,
  ],
})
export class SalesModule {}
