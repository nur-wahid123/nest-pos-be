import { Expose } from 'class-transformer';
import {
    Entity,
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'suppliers' })
export class Supplier {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true })
    code!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: true })
    email!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column({ nullable: true, type: 'text' })
    address!: string;

    /**
     * Relations
     */
    @ManyToOne(() => City, (city) => city.suppliers, {
        nullable: true,
    })
    city: City;

    @OneToMany(() => Product, (products) => products.supplier, {
        nullable: true,
    })
    products!: Product[];

    @OneToMany(() => PurchaseOrder, (purchaseOrders) => purchaseOrders.supplier, {
        nullable: false,
    })
    purchaseOrders!: PurchaseOrder[];

    @OneToMany(
        () => PurchaseReceived,
        (purchaseReceiveds) => purchaseReceiveds.supplier,
        {
            nullable: false,
        },
    )
    purchaseReceiveds!: PurchaseReceived[];

    @OneToMany(() => Purchase, (purchases) => purchases.supplier, {
        nullable: false,
    })
    purchases!: Purchase[];

    @OneToMany(
        () => PurchaseReturn,
        (purchaseReturns) => purchaseReturns.supplier,
        {
            nullable: false,
        },
    )
    purchaseReturns!: PurchaseReturn[];

    @OneToMany(() => Consignment, (consignments) => consignments.supplier, {
        nullable: false,
    })
    consignments!: Consignment[];

    @OneToMany(
        () => ConsignmentReturn,
        (consignmentReturn) => consignmentReturn.supplier,
        {
            nullable: false,
        },
    )
    consignmentReturns!: ConsignmentReturn[];

    @OneToMany(
        () => PurchaseConsignment,
        (purchaseConsignments) => purchaseConsignments.supplier,
        {
            nullable: false,
        },
    )
    purchaseConsignments!: PurchaseConsignment[];

    @OneToMany(() => Payment, (payments) => payments.supplier, {
        nullable: true,
    })
    payments!: Payment[];

    @OneToMany(
        () => BankTransaction,
        (bankTransactions) => bankTransactions.supplier,
        {
            nullable: false,
        },
    )
    bankTransactions: BankTransaction[];

    @OneToMany(() => InventoryOut, (inventoryOuts) => inventoryOuts.supplier, {
        nullable: false,
    })
    inventoryOuts: InventoryOut[];

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
