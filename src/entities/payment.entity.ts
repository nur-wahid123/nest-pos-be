import { Expose, Type } from 'class-transformer';
import {
    Entity,
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Purchase } from './purchase.entity';
import { PaymentType } from 'src/modules/payments/enum/payment-type.enum';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true })
    code!: string;

    @Column({ nullable: false, type: 'date' })
    date!: Date;

    @Column({ nullable: false, type: 'text', default: '-' })
    note!: string;

    @Column({ nullable: true, type: 'double precision', default: 0 })
    @Type(() => Number)
    paid!: number;

    @Column({ type: 'enum', enum: PaymentType, nullable: false })
    @Expose({ name: "payment_type" })
    paymentType!: PaymentType


    /**
     * Relations
     */

    @ManyToOne(() => Sale, (sale) => sale.payments, { nullable: true })
    sale: Sale;

    @ManyToOne(() => Purchase, (purchase) => purchase.payments, { nullable: true })
    purchase: Purchase;

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
