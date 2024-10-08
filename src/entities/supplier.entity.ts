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
import { Product } from './product.entity';
import { City } from './city.entity';
import { Purchase } from './purchase.entity';

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

    @OneToMany(() => Purchase, (purchase) => purchase.supplier, {
        nullable: true,
    })
    purchases!: Purchase[];


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
