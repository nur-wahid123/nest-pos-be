import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from 'src/entities/purchase.entity';

export class QueryPurchaseListDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  supplier!: string;

  @IsOptional()
  @IsString()
  product!: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'product_code' })
  productCode!: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'product_name' })
  productName!: string;

  @IsOptional()
  @IsString()
  category!: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  @Expose({ name: 'date' })
  date!: Date;
}
