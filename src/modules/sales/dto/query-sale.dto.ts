import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QuerySaleDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'sale_code' })
  saleCode?: string;
}
