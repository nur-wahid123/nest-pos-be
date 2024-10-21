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
<<<<<<< HEAD
import { PaymentType } from 'src/modules/payments/enum/payment-type.enum';
import CommonBaseMerchantEntity from './base/base-merchant.entity';
=======
>>>>>>> master

@Entity({ name: 'payments' })
export class Payment extends CommonBaseMerchantEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, unique: true })
    code!: string;

    @Column({ nullable: false, type: 'date' })
    date!: Date;

    @Column({ nullable: false, type: 'text', default: '-' })
    note!: string;

    @Column({ nullable: false, type: 'double precision', default: 0 })
    @Type(() => Number)
    total!: number;

    @Column({ nullable: false, type: 'double precision', default: 0 })
    @Type(() => Number)
    paid!: number;


    /**
     * Relations
     */

    @OneToOne(() => Sale, (sale) => sale.payment, { nullable: true })
    sale: Sale;

    @OneToOne(() => Purchase, (purchase) => purchase.payment, { nullable: true })
    purchase: Purchase;
}
