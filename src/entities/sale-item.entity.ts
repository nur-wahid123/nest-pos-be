import { Expose, Type } from 'class-transformer';
import {
    Entity,
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { Sale } from './sale.entity';

@Entity({ name: 'sale_items' })
export default class SaleItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, type: 'bigint' })
    @Type(() => Number)
    price!: number;

    @Column({ nullable: false, type: 'bigint' })
    @Expose({ name: 'sub_total' })
    @Type(() => Number)
    subTotal!: number;

    @Column({ nullable: false })
    @Type(() => Number)
    qty!: number;

    /**
     * Relations
     */

    @ManyToOne(() => Sale, (sale) => sale.saleItems, {
        nullable: false,
    })
    sale!: Sale;

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
