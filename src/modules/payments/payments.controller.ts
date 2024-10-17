import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreatePaymentDto } from '../purchases/dto/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
}
