import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusCount } from '../enums/status-count.enum';

export class FilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(StatusCount)
  status?: StatusCount;
}
