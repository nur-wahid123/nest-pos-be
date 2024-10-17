import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QueryProductListDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'category_id' })
  categoryId: string;
}
