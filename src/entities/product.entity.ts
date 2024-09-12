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
    OneToOne,
} from 'typeorm';
import Brand from './brand.entity';
import SaleItem from './sale-item.entity';
import { Supplier } from './supplier.entity';
import { Uom } from './uom.entity';
import Category from './category.entity';
import { Inventory } from './inventory.entity';
import { PurchaseItem } from './purchase-item.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true })
    code!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false, type: 'bigint' })
    @Expose({ name: 'buy_price' })
    @Type(() => Number)
    buyPrice!: number;

    @Column({ nullable: false, type: 'bigint' })
    @Expose({ name: 'sell_price' })
    @Type(() => Number)
    sellPrice!: number;

    @Column({ nullable: true, default: 1 })
    @Type(() => Number)
    min!: number;

    /**
     * Relations
     */
    @ManyToOne(() => Uom, (uoms) => uoms.products, {
        nullable: false,
    })
    uom!: Uom;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
    })
    category!: Category;

    @ManyToOne(() => Brand, (brand) => brand.products, {
        nullable: false,
    })
    brand!: Brand;

    @ManyToOne(() => Supplier, (supplier) => supplier.products, {
        nullable: true,
    })
    supplier!: Supplier;

    @OneToMany(() => SaleItem, (saleItems) => saleItems.product, {
        nullable: false,
    })
    @Expose({ name: 'sale_items' })
    saleItems!: SaleItem[];

    @OneToOne(() => Inventory, (inventory) => inventory.product, { nullable: true })
    inventory!: Inventory

    @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product, { nullable: false })
    @Expose({ name: 'purchase_items' })
    purchaseItems!: PurchaseItem

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
