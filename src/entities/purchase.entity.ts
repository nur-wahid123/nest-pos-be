import { Expose, Type } from 'class-transformer';
import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { Supplier } from './supplier.entity';
import { Payment } from './payment.entity';
import InventoryLedger from './inventory-ledger.entity';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  code!: string;

  @Column({ nullable: false, type: 'text', default: '-' })
  note!: string;

  @Column({ nullable: true, type: 'date' })
  date!: Date;

  @Column({ nullable: false, type: 'bigint' })
  @Type(() => Number)
  total!: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: PaymentStatus,
    default: 'unpaid',
  })
  @Expose({ name: 'payment_status' })
  paymentStatus!: PaymentStatus;

  /**
   * Relations
   */

  @OneToMany(() => PurchaseItem, (purchaseItems) => purchaseItems.purchase, {
    nullable: false,
  })
  @Expose({ name: 'purchase_items' })
  purchaseItems!: PurchaseItem[];

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases, {
    nullable: false,
  })
  supplier!: Supplier;

  @OneToMany(() => Payment, (payment) => payment.purchase, { nullable: true })
  payments!: Payment[]

  @OneToMany(() => InventoryLedger, (inventoryLedger) => inventoryLedger.purchase, { nullable: true })
  inventoryLedgers: InventoryLedger[]


  /**
 * Changelog
 */

  @CreateDateColumn({ type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @Column({ nullable: true })
  @Expose({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ nullable: true })
  @Expose({ name: 'updated_by' })
  updatedBy!: number;

  /**
   * Soft deletion
  */
  @DeleteDateColumn({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  @Expose({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ default: null, nullable: true })
  @Expose({ name: 'deleted_by' })
  deletedBy!: number;
}
