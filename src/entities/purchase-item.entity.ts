import { Expose, Type } from 'class-transformer';
import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Purchase } from './purchase.entity';

@Entity({ name: 'purchase_items' })
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  @Type(() => Number)
  qty!: number;

  @Column({ nullable: false, type: 'bigint' })
  @Expose({ name: 'buy_price' })
  @Type(() => Number)
  buyPrice!: number;

  @Column({ nullable: false, type: 'bigint' })
  @Expose({ name: 'sub_total' })
  @Type(() => Number)
  subTotal!: number;

  /**
   * Relations
   */

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseItems, {
    nullable: false,
  })
  purchase!: Purchase;

  @ManyToOne(() => Product, (product) => product.purchaseItems, {
    nullable: false,
  })
  product!: Product;

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
