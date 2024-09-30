import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCityDto {

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    capital!: string;

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: "province_id" })
    provinceId!: number;
}