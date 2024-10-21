import { Exclude, Expose } from 'class-transformer';
import {
    Entity,
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { Purchase } from './purchase.entity';
import { Sale } from './sale.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';


@Entity({ name: 'inventory_ledger' })
export default class InventoryLedger extends CommonBaseMerchantEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    qty!: number;

    @Column({ nullable: false })
    direction!: number

    @Column({ nullable: false })
    @Expose({ name: 'qty_before_update' })
    qtyBeforeUpdate!: number;

    @Column({ nullable: false })
    @Expose({ name: 'qty_after_update' })
    qtyAfterUpdate!: number;

    /**
     * Relations
     */
    @ManyToOne(() => Inventory, (inventory) => inventory.inventoryLedgers, {
        nullable: false,
    })
    inventory!: Inventory;

    @ManyToOne(() => Purchase, (purchase) => purchase.inventoryLedgers, { nullable: true })
    purchase?: Purchase;

    @ManyToOne(() => Sale, (sale) => sale.inventoryLedgers, { nullable: true })
    sale?: Sale
}
