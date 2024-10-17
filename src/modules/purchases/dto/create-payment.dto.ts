import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'purchase_code' })
  purchaseCode!: string;

  @IsNotEmpty()
  @IsNumber()
  paid!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
