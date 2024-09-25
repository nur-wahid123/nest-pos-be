import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { PurchaseItemRepository } from 'src/repositories/purchase-item.repository';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, UserRepository, SupplierRepository, ProductRepository, PurchaseRepository, PurchaseItemRepository],
})
export class PurchasesModule { }
