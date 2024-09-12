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

@Entity({ name: 'categories' })
export default class Category {
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
