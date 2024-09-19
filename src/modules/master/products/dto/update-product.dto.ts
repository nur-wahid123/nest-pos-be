import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name!: string

    @IsOptional()
    @IsString()
    code!: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Expose({ name: 'buy_price' })
    buyPrice!: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Expose({ name: 'sell_price' })
    sellPrice!: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'uom_id' })
    uomId!: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'supplier_id' })
    supplierId!: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'brand_id' })
    brandId!: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'category_id' })
    categoryId!: number
}
