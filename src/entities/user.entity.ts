import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  UNSPECIFIED = 'unspecified'
}

@Entity({ name: 'users' })
export class User {
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
