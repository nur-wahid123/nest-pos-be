import { Expose, Type } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Sale } from './sale.entity';
import { Purchase } from './purchase.entity';
import { PaymentType } from '../modules/payments/enum/payment-type.enum';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'payments' })
export class Payment extends CommonBaseMerchantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  code!: string;

  @Column({ nullable: false, type: 'date' })
  date!: Date;

  @Column({ nullable: false, type: 'text', default: '-' })
  note!: string;

  @Column({ nullable: true, type: 'double precision', default: 0 })
  @Type(() => Number)
  paid!: number;

  @Column({ type: 'enum', enum: PaymentType, nullable: false })
  @Expose({ name: 'payment_type' })
  paymentType!: PaymentType;

  /**
   * Relations
   */

  @ManyToOne(() => Sale, (sale) => sale.payments, { nullable: true })
  sale: Sale;

  @ManyToOne(() => Purchase, (purchase) => purchase.payments, {
    nullable: true,
  })
  purchase: Purchase;
}
