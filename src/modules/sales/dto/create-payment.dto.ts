import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSalePaymentDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'sale_code' })
  saleCode!: string;

  @IsNotEmpty()
  @IsNumber()
  paid!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
