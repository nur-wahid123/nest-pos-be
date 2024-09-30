import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Expose } from "class-transformer";
import InventoryLedger from "./inventory-ledger.entity";

@Entity({ name: 'inventories' })
export class Inventory {
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