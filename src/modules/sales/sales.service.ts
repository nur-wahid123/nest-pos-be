import { Injectable, NotFoundException } from '@nestjs/common';
import { SaleRepository } from 'src/repositories/sale.repository';
import { CreateSaleDto, CreateSaleItemDto } from './dto/create-sale.dto';
import SaleItem from 'src/entities/sale-item.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { In } from 'typeorm';

@Injectable()
export class SalesService {
    constructor(
        private readonly saleRepository: SaleRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    create(createSaleDto: CreateSaleDto, userId: number) {
        const reducedSaleItems = this.reduceDublicateProduct(
            createSaleDto.saleItems,
        );
        const newSaleItems = this.mapSaleItems(reducedSaleItems, userId);
    }

    private reduceDublicateProduct(
        data: CreateSaleItemDto[],
    ): CreateSaleItemDto[] {
        return Object.values(
            data.reduce(
                (acc, saleItem) => {
                    if (acc[saleItem.productId]) {
                        acc[saleItem.productId].qty += saleItem.qty;
                    } else {
                        acc[saleItem.productId] = { ...saleItem };
                    }
                    return acc;
                },
                {} as { [product_id: number]: CreateSaleItemDto },
            ),
        );
    }

    private async mapSaleItems(
        data: CreateSaleItemDto[],
        userId: number,
    ): Promise<SaleItem[]> {
        const productIds = data.map((v) => v.productId);
        const products = await this.productRepository.find({
            where: { id: In(productIds) },
            relations: { inventory: true },
        });
        if (productIds.length !== products.length)
            throw new NotFoundException('one or more products not found');
        products.map((v) => {
            if (v?.inventory.qty <= 0)
                throw new NotFoundException('one or more products not found');
        });
        const saleItems: SaleItem[] = [];
        for (let index = 0; index < data.length; index++) {
            const v = data[index];
            const { price, productId, qty } = v;
            const saleItem = new SaleItem();
            saleItem.createdBy = userId;
            saleItem.price = price;
            saleItem.product = products.find((item) => item.id == productId);
            saleItem.qty = qty;
            saleItem.subTotal = Number(qty) * Number(price);
            saleItems.push(saleItem);
        }
        return saleItems;
    }
}
