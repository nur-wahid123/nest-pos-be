import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CommonBaseMerchantEntity from './base/base-merchant.entity';

export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  UNSPECIFIED = 'unspecified'
}

@Entity({ name: 'users' })
export class User extends CommonBaseMerchantEntity {
  /**
   * Columns
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  email: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  /**
   * m - male
   * f - female
   * u - unspecified
   */
  gender: Gender;

  /**
   * Relations
   */

}
