import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'product_id' })
  productId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  qty?: number;
}

export class BatchUpdateInventoryDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateInventoryDto)
  items: UpdateInventoryDto[];
}
