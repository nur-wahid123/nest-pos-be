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
import { Supplier } from './supplier.entity';
<<<<<<< HEAD
import { Province } from './province.entity';
import CommonBaseEntity from './base/base.entity';
=======
>>>>>>> master

@Entity({ name: 'cities' })
export class City extends CommonBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    island!: string;

    @Column({ nullable: false })
    province!: string;

    @Column({ nullable: false })
    capital!: string;

    /**
     * Relations
     */

    @OneToMany(() => Supplier, (suppliers) => suppliers.city, {
        nullable: true,
    })
    suppliers!: Supplier[];

}
