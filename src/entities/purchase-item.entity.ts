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
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'purchase_items' })
export class PurchaseItem extends CommonBaseMerchantEntity {
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
    lazy: true,
  })
  purchase!: Purchase;

  @ManyToOne(() => Product, (product) => product.purchaseItems, {
    nullable: false,
  })
  product!: Product;
}
