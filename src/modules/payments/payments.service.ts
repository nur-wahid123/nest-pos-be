import { Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/repositories/payment.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly peymentRepository: PaymentRepository) {}
}
