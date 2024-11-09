import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Expose } from 'class-transformer';
import InventoryLedger from './inventory-ledger.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'inventories' })
export class Inventory extends CommonBaseMerchantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, default: 0 })
  qty: number;

  /**
   * Relations
   */
  @OneToOne(() => Product, (product) => product.inventory, {
    nullable: false,
  })
  @JoinColumn()
  product!: Product;

  @OneToMany(
    () => InventoryLedger,
    (inventoryLedgers) => inventoryLedgers.inventory,
    {
      nullable: false,
    },
  )
  @Expose({ name: 'inventory_ledger' })
  inventoryLedgers!: InventoryLedger[];
}
