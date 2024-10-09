import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SaleRepository } from 'src/repositories/sale.repository';
import { CreateSaleDto, CreateSaleItemDto } from './dto/create-sale.dto';
import SaleItem from 'src/entities/sale-item.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { In } from 'typeorm';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { CreateSalePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class SalesService {
    constructor(
        private readonly saleRepository: SaleRepository,
        private readonly productRepository: ProductRepository,
        private readonly paymentRepository: PaymentRepository
    ) { }

    async createPayment(createSalePaymentDto: CreateSalePaymentDto, userId: number) {
        return this.paymentRepository.paySale(createSalePaymentDto, userId)
    }

    async create(createSaleDto: CreateSaleDto, userId: number) {
        const reducedSaleItems = this.reduceDublicateProduct(
            createSaleDto.saleItems,
        );
        const newSaleItems = await this.mapSaleItems(reducedSaleItems, userId);

        const total = newSaleItems.reduce(
            (sum, saleItems) => sum + saleItems.subTotal
            , 0
            ,
        )
        const code = await this.saleRepository.autoGenerateCode(
            createSaleDto.date,
        );

        return await this.saleRepository.createSale(
            code,
            createSaleDto,
            newSaleItems,
            total,
            userId
        )
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
            if (!v?.inventory) throw new NotFoundException('one or more products is out of stock');
            if (v?.inventory.qty <= 0)
                throw new NotFoundException('one or more products is out of stock');
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

    async needToPay(saleCode: string): Promise<number> {
        const sale = await this.saleRepository.findOne(
            {
                where:
                {
                    code:
                        saleCode
                }
                , relations:
                {
                    payments: true,
                    saleItems: true
                }
            })
        if (sale.paymentStatus === PaymentStatus.PAID) throw new BadRequestException('purchase already paid')
        return this.paymentRepository.calculateSaleNeedToPay(sale)
    }
}