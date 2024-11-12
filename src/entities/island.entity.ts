import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import CommonBaseEntity from './base/base.entity';
import { Province } from './province.entity';

@Entity({ name: 'islands' })
export class Island extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  /**
   * Relations
   */

  @OneToMany(() => Province, (province) => province.island, {
    nullable: true,
  })
  provinces!: Province[];
}
