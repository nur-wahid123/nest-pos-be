import { IsOptional, IsString } from 'class-validator';

export class QueryInventoryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
