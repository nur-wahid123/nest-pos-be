import { PartialType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { Purchase } from 'src/entities/purchase.entity';
import { User } from 'src/entities/user.entity';

export class GetPurchaseWithUserDto extends PartialType(Purchase) {
  @Expose({ name: 'created_by_user' })
  createdByUser: User;
}
