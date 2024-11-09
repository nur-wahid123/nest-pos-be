import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Province } from './province.entity';
import CommonBaseEntity from './base/base.entity';

@Entity({ name: 'cities' })
export class City extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  capital!: string;

  /**
   * Relations
   */

  @ManyToOne(() => Province, (province) => province.cities)
  province!: Province;

  @OneToMany(() => Supplier, (suppliers) => suppliers.city, {
    nullable: true,
  })
  suppliers!: Supplier[];
}
