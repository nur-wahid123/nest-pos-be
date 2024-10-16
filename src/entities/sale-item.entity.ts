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
import { Product } from './product.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'sale_items' })
export default class SaleItem extends CommonBaseMerchantEntity {
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

    @ManyToOne(() => Product, (product) => product.saleItems, {
        nullable: false,
    })
    product!: Product;
}
