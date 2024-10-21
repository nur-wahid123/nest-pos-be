import { Expose, Type } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne } from 'typeorm';
import SaleItem from './sale-item.entity';
import { Payment } from './payment.entity';
import InventoryLedger from './inventory-ledger.entity';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import CommonBaseMerchantEntity from './base/base-merchant.entity';
@Entity({ name: 'sales' })
export class Sale extends CommonBaseMerchantEntity {
    /**
   * Columns
   */
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    @Expose({ name: 'code' })
    code!: string

    @Column({ type: 'date' })
    date!: Date;

    @Column({ type: 'date' })
    @Expose({ name: 'due_date' })
    dueDate!: Date;

    @Column({ type: 'text', nullable: true })
    note?: string

    @Column({ type: 'bigint', nullable: false })
    @Type(() => Number)
    total!: number

    @Column({ enum: PaymentStatus, default: PaymentStatus.UNPAID })
    @Expose({ name: 'payment_status' })
    paymentStatus!: PaymentStatus

    /**
     * Relations
     */

    @OneToMany(() => SaleItem, (saleItems) => saleItems.sale, {
        nullable: false,
    })
    @Expose({ name: 'sale_items' })
    saleItems: SaleItem[];

    @OneToMany(() => Payment, (payment) => payment.sale, { nullable: true })
    payments: Payment[]

    @OneToMany(() => InventoryLedger, (inventoryLedger) => inventoryLedger.sale, { nullable: true })
    inventoryLedgers: InventoryLedger[]
}
