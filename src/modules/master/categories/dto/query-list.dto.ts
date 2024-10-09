import { IsOptional, IsString } from "class-validator";

export class QueryListDto {
    @IsOptional()
    @IsString()
    search?: string
}