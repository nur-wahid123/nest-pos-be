import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { City } from './city.entity';
import { Purchase } from './purchase.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'suppliers' })
export class Supplier extends CommonBaseMerchantEntity {
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
}
