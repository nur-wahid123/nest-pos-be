import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import CommonBaseEntity from './base/base.entity';
import { Expose } from 'class-transformer';
import { Status } from '../common/enums/status.enum';

@Entity('merchants')
export class Merchant extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  code!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  @Expose({ name: 'owner_name' })
  ownerName!: string;

  @Column({ nullable: false })
  @Expose({ name: 'phone' })
  phone!: string;

  @Column({ nullable: false })
  @Expose({ name: 'email' })
  email!: string;

  @Column({ nullable: true })
  @Expose({ name: 'address' })
  address?: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Status,
    default: Status.INACTIVE,
  })
  status!: Status;

  @Column({ nullable: true })
  @Expose({ name: 'logo_url' })
  logoUrl?: string;

  @Column({ nullable: true })
  @Expose({ name: 'website' })
  bannwebsiteerUrl?: string;
}
