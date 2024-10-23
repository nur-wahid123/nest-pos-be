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

export class CreateSaleDto {
  @IsNotEmpty()
  @IsDateString()
  date!: Date;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsArray()
  @Expose({ name: 'sale_items' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  saleItems!: CreateSaleItemDto[];
}

export class CreateSaleItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'product_id' })
  productId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qty!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
