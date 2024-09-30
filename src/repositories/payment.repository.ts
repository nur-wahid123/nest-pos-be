import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { autoGenerateCodeBank } from "src/common/utils/multi-payment-process.util";
import InventoryLedger from "src/entities/inventory-ledger.entity";
import { Inventory } from "src/entities/inventory.entity";
import { Payment } from "src/entities/payment.entity";
import { Product } from "src/entities/product.entity";
import { PurchaseItem } from "src/entities/purchase-item.entity";
import { Purchase } from "src/entities/purchase.entity";
import { CreatePaymentDto } from "src/modules/purchases/dto/create-payment.dto";
import { PaymentType } from "src/modules/payments/enum/payment-type.enum";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    constructor(private readonly dataSource: DataSource) {
        super(Payment, dataSource.createEntityManager())
    }

    async pay(
        paymentDto: CreatePaymentDto,
        userId: number
    ) {
        const { paid, purchaseCode, note } = paymentDto
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect();

        await queryRunner.startTransaction();
        const purchase = await queryRunner.manager.findOne(Purchase,
            {
                where:
                {
                    code:
                        purchaseCode
                }
                , relations:
                {
                    payments: true,
                    purchaseItems: { product: true }
                }
            })
        if (purchase.paymentStatus === PaymentStatus.PAID) throw new BadRequestException('purchase already paid')
        const needToPay = await this.calculateNeedToPay(purchase)
        if (Number(paid) > Number(needToPay)) throw new BadRequestException('The payment amount must not exceed the amount due')
        try {
            const payment = new Payment()
            if (Number(needToPay) === Number(paid)) {
                purchase.paymentStatus = PaymentStatus.PAID
                purchase.updatedBy = userId
                payment.paymentType = PaymentType.PAIDOFF
                await this.addProductToInventory(queryRunner.manager, purchase.purchaseItems, userId)
            } else {
                purchase.paymentStatus = PaymentStatus.PARTIALPAID
                purchase.updatedBy = userId
                payment.paymentType = PaymentType.PARTIAL
            }
            await queryRunner.manager.save(purchase)
            payment.code = await autoGenerateCodeBank(new Date(), queryRunner.manager, 'PY')
            payment.date = new Date()
            payment.createdBy = userId
            if (note) {
                payment.note = note
            }
            payment.paid = paid
            payment.purchase = purchase
            await queryRunner.manager.save(payment)
            await queryRunner.commitTransaction()

            return payment

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }
    }

    async calculateNeedToPay(purchase: Purchase): Promise<number> {
        let needToPay = purchase.total
        for (let index = 0; index < purchase.payments.length; index++) {
            const payment = purchase.payments[index];
            needToPay = Number(needToPay) - Number(payment.paid)
        }
        return needToPay
    }

    async addProductToInventory(ettManager: EntityManager, purchaseItems: PurchaseItem[], userId: number) {
        purchaseItems.map(async (v) => {
            let inventory = await ettManager.findOne(Inventory, { where: { product: v?.product } })

            if (!inventory) {
                inventory = ettManager.create(Inventory, { product: v?.product, qty: v?.qty, createdBy: userId })
                console.log(inventory, v);
                await ettManager.save(inventory)
                const inventoryLedger = ettManager.create(InventoryLedger, { inventory: inventory, qty: v?.qty, qtyBeforeUpdate: 0, qtyAfterUpdate: v?.qty, direction: 1, createdBy: userId, })
                await ettManager.save(inventoryLedger)
            } else {
                const inventoryLedger = ettManager.create(InventoryLedger, { inventory: inventory, qty: v?.qty, qtyBeforeUpdate: inventory.qty, qtyAfterUpdate: Number(v?.qty) + Number(inventory.qty), direction: 1, createdBy: userId, })
                inventory.qty = Number(inventory.qty) + Number(v?.qty)
                await ettManager.save(inventory)
                await ettManager.save(inventoryLedger)
            }
        })
    }

}