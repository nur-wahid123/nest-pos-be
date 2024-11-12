import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import CommonBaseEntity from './base/base.entity';
import { Island } from './island.entity';
import { City } from './city.entity';

@Entity({ name: 'provinces' })
export class Province extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  /**
   * Relations
   */

  @ManyToOne(() => Island, (island) => island.provinces)
  island!: Island;

  @OneToMany(() => City, (city) => city.province)
  cities!: City[];
}
