import { Expose } from 'class-transformer';
import {
    Entity,
    CreateDateColumn,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    DeleteDateColumn,
    UpdateDateColumn,
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
    cities!: City[]

}
