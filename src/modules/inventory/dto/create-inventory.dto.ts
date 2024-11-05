import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'product_id' })
  productId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  qty?: number;
}

export class BatchCreateInventoryDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateInventoryDto)
  items: CreateInventoryDto[];
}
