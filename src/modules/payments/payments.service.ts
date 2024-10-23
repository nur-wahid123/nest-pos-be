import { Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { CreatePaymentDto } from '../purchases/dto/create-payment.dto';
import { PurchaseRepository } from 'src/repositories/purchase.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly peymentRepository: PaymentRepository) {}
}
