import { Expose } from "class-transformer"
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateSupplierDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsString()
    @IsNotEmpty()
    phone!: string

    @IsString()
    @IsNotEmpty()
    address!: string

    @IsNumber()
    @IsNotEmpty()
    @Expose({ name: 'city_id' })
    cityId!: number
}
