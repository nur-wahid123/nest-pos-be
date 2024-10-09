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
import { Sale } from "src/entities/sale.entity";
import { CreateSalePaymentDto } from "src/modules/sales/dto/create-payment.dto";
import SaleItem from "src/entities/sale-item.entity";

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    constructor(private readonly dataSource: DataSource) {
        super(Payment, dataSource.createEntityManager())
    }

    /**
     * Pay for a sale.
     * @param paymentDto the payment details
     * @param userId the user id
     * @returns the payment
     * @throws BadRequestException if the sale is already paid
     * @throws BadRequestException if the payment amount is more than the amount due
     * @throws InternalServerErrorException if there is an error
     */
    async paySale(
        paymentDto: CreateSalePaymentDto,
        userId: number
    ) {
        const { paid, saleCode, note } = paymentDto
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect();

        await queryRunner.startTransaction();
        const sale = await queryRunner.manager.findOne(Sale,
            {
                where:
                {
                    code:
                        saleCode
                }
                , relations:
                {
                    payments: true,
                    saleItems: { product: true }
                }
            })
        if (sale.paymentStatus === PaymentStatus.PAID) throw new BadRequestException('purchase already paid')
        const needToPay = await this.calculateSaleNeedToPay(sale)
        if (Number(paid) > Number(needToPay)) throw new BadRequestException('The payment amount must not exceed the amount due')
        try {
            const payment = new Payment()
            if (Number(needToPay) === Number(paid)) {
                sale.paymentStatus = PaymentStatus.PAID
                sale.updatedBy = userId
                payment.paymentType = PaymentType.PAIDOFF
                await this.substractProductToInventory(queryRunner.manager, sale.saleItems, userId)
            } else {
                if (sale.paymentStatus === PaymentStatus.UNPAID) {
                    sale.paymentStatus = PaymentStatus.PARTIALPAID
                    sale.updatedBy = userId
                    payment.paymentType = PaymentType.PARTIAL
                    await this.substractProductToInventory(queryRunner.manager, sale.saleItems, userId)
                } else {
                    sale.paymentStatus = PaymentStatus.PARTIALPAID
                    sale.updatedBy = userId
                    payment.paymentType = PaymentType.PARTIAL
                }
            }
            await queryRunner.manager.save(sale)
            payment.code = await autoGenerateCodeBank(new Date(), queryRunner.manager, 'PY')
            payment.date = new Date()
            payment.createdBy = userId
            if (note) {
                payment.note = note
            }
            payment.paid = paid
            payment.sale = sale
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


    async payPurchase(
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
        const needToPay = await this.calculatePurchaseNeedToPay(purchase)
        if (Number(paid) > Number(needToPay)) throw new BadRequestException('The payment amount must not exceed the amount due')
        try {
            const payment = new Payment()
            if (Number(needToPay) === Number(paid)) {
                purchase.paymentStatus = PaymentStatus.PAID
                purchase.updatedBy = userId
                payment.paymentType = PaymentType.PAIDOFF
                await this.addProductToInventory(queryRunner.manager, purchase.purchaseItems, userId)
            } else {
                if (purchase.paymentStatus === PaymentStatus.UNPAID) {
                    purchase.paymentStatus = PaymentStatus.PARTIALPAID
                    purchase.updatedBy = userId
                    payment.paymentType = PaymentType.PARTIAL
                    await this.addProductToInventory(queryRunner.manager, purchase.purchaseItems, userId)
                } else {
                    purchase.paymentStatus = PaymentStatus.PARTIALPAID
                    purchase.updatedBy = userId
                    payment.paymentType = PaymentType.PARTIAL
                }
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

    async calculatePurchaseNeedToPay(purchase: Purchase): Promise<number> {
        let needToPay = purchase.total
        for (let index = 0; index < purchase.payments.length; index++) {
            const payment = purchase.payments[index];
            needToPay = Number(needToPay) - Number(payment.paid)
        }
        return needToPay
    }

    /**
     * Check if the payment is late and calculate late fees
     * @param paymentDate The date of payment
     * @param dueDate The due date of the sale
     * @param total The total amount of the sale
     * @returns The late fees amount
     */
    private async checkLateFees(paymentDate: Date, dueDate: Date, total: number): Promise<number> {
        const diffTime = Math.abs(paymentDate.getTime() - dueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const lateFeesPerWeek = total * 0.05
        const weeks = Math.ceil(diffDays / 7)
        return lateFeesPerWeek * weeks
    }

    /**
     * Calculate the amount that still needs to be paid for a sale.
     * @param sale The sale to calculate the amount for.
     * @returns The amount that still needs to be paid.
     */
    async calculateSaleNeedToPay(sale: Sale): Promise<number> {
        let needToPay = sale.total;
        for (let index = 0; index < sale.payments.length; index++) {
            const payment = sale.payments[index];
            needToPay = Number(needToPay) - Number(payment.paid);
        }
        if (sale.dueDate) {
            const lateFees = await this.checkLateFees(sale.date, sale.dueDate, sale.total);
            needToPay = Number(needToPay) + Number(lateFees);
        }
        return needToPay;
    }    /**
     * Substract product to inventory
     * @param ettManager entity manager
     * @param saleItems sale items
     * @param userId user id
     */    async substractProductToInventory(ettManager: EntityManager, saleItems: SaleItem[], userId: number) {
        saleItems.map(async (v) => {
            let inventory = await ettManager.findOne(Inventory, { where: { product: v?.product } })

            if (inventory) {
                const inventoryLedger = ettManager.create(InventoryLedger, { inventory: inventory, qty: v?.qty, qtyBeforeUpdate: inventory.qty, qtyAfterUpdate: Number(v?.qty) + Number(inventory.qty), direction: 1, createdBy: userId, })
                inventory.qty = Number(inventory.qty) + Number(v?.qty)
                await ettManager.save(inventory)
                await ettManager.save(inventoryLedger)
            }
        })
    }
    /**
     * Add product to inventory
     * @param ettManager entity manager
     * @param purchaseItems purchase items
     * @param userId user id
     */
    async addProductToInventory(ettManager: EntityManager, purchaseItems: PurchaseItem[], userId: number) {
        purchaseItems.map(async (v) => {
            let inventory = await ettManager.findOne(Inventory, { where: { product: v?.product } })

            if (!inventory) {
                inventory = ettManager.create(Inventory, { product: v?.product, qty: v?.qty, createdBy: userId })
                console.log(inventory, v);
                await ettManager.save(inventory)
                const inventoryLedger = ettManager.create(InventoryLedger, { purchase: v?.purchase, inventory: inventory, qty: v?.qty, qtyBeforeUpdate: 0, qtyAfterUpdate: v?.qty, direction: 1, createdBy: userId, })
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