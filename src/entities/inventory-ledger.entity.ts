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
<<<<<<< HEAD
import { Purchase } from './purchase.entity';
import { Sale } from './sale.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';
=======
>>>>>>> master


@Entity({ name: 'inventory_ledger' })
export default class InventoryLedger extends CommonBaseMerchantEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    qty!: number;

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

<<<<<<< HEAD
    @ManyToOne(() => Purchase, (purchase) => purchase.inventoryLedgers, { nullable: true })
    purchase?: Purchase;

    @ManyToOne(() => Sale, (sale) => sale.inventoryLedgers, { nullable: true })
    sale?: Sale
=======
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
>>>>>>> master
}
