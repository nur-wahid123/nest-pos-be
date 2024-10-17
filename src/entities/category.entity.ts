import { Expose } from 'class-transformer';
import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'categories' })
export default class Category extends CommonBaseMerchantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  code!: string;

  @Column({ nullable: false })
  name!: string;

  /**
   * Relations
   */
  @OneToMany(() => Product, (products) => products.category, {
    nullable: false,
  })
  products!: Product[];
}
