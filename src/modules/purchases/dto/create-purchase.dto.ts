import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'supplier_id' })
  supplierId: number;

  @IsOptional()
  @IsString()
  note!: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  @Expose({ name: 'purchase_items' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  purchaseItems: CreatePurchaseItemDto[];
}

export class CreatePurchaseItemDto {
  @IsNotEmpty()
  @IsNumber()
  product_id!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qty!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  buy_price!: number;
}
