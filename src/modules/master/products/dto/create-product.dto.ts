import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsString()
    code!: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Expose({ name: 'buy_price' })
    buyPrice!: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Expose({ name: 'sell_price' })
    sellPrice!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'uom_id' })
    uomId!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'supplier_id' })
    supplierId!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'brand_id' })
    brandId!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'category_id' })
    categoryId!: number
}
