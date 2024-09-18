import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { PurchaseItemRepository } from 'src/repositories/purchase-item.repository';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchaseRepository, PurchaseItemRepository],
})
export class PurchasesModule { }
