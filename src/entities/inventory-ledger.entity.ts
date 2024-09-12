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


@Entity({ name: 'inventory_ledger' })
export default class InventoryLedger {
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
