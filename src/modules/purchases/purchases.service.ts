import { Injectable } from '@nestjs/common';
import { PurchaseRepository } from 'src/repositories/purchase.repository';

@Injectable()
export class PurchasesService {
    constructor(private readonly purchaseRepo: PurchaseRepository) { }
    findAll() {
        this.purchaseRepo.find({ relations: { supplier: true, payment: true, purchaseItems: true } })
    }
}
