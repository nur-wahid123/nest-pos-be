import { Expose, Type } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne } from 'typeorm';
import SaleItem from './sale-item.entity';
import { Payment } from './payment.entity';
import InventoryLedger from './inventory-ledger.entity';
@Entity({ name: 'sales' })
export class Sale {
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

    @Column({ type: 'text' })
    note!: string

    @Column({ type: 'bigint', nullable: false })
    @Type(() => Number)
    total!: number

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
