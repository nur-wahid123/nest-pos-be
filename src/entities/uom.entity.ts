import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

@Entity({ name: 'uoms' })
export class Uom extends CommonBaseMerchantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  /**
   * Relations
   */

  @OneToMany(() => Product, (products) => products.uom, {
    nullable: false,
  })
  products!: Product[];
}
