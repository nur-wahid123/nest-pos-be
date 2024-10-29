import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SaleRepository } from 'src/repositories/sale.repository';
import { CreateSaleDto, CreateSaleItemDto } from './dto/create-sale.dto';
import SaleItem from 'src/entities/sale-item.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { In } from 'typeorm';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { CreateSalePaymentDto } from './dto/create-payment.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { QueryDateRangeDto } from 'src/common/dto/query-purchase-date-range.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class SalesService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly paymentRepository: PaymentRepository,
  ) { }

  async findAll(query: QuerySaleDto,dateRange:QueryDateRangeDto,pageOptionsDto:PageOptionsDto) {
    const [data,itemCount] = await this.saleRepository.findSales(query,dateRange,pageOptionsDto);
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, pageMeta);
  }

  async createPayment(
    createSalePaymentDto: CreateSalePaymentDto,
    userId: number,
  ) {
    if (createSalePaymentDto.paid <= 0)
      throw new BadRequestException('invalid payment amount');
    return this.paymentRepository.paySale(createSalePaymentDto, userId);
  }

  async create(createSaleDto: CreateSaleDto, userId: number) {
    try {

      const reducedSaleItems = this.reduceDublicateProduct(
        createSaleDto.saleItems,
      );
      const newSaleItems = await this.mapSaleItems(reducedSaleItems, userId);

      const total = newSaleItems.reduce(
        (sum, saleItems) => sum + saleItems.subTotal,
        0,
      );

      return await this.saleRepository.createSale(
        createSaleDto,
        newSaleItems,
        total,
        userId,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server error')
    }
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
      if (!v?.inventory)
        throw new NotFoundException('one or more products is out of stock');
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

  async needToPay(
    saleCode: string,
  ): Promise<{ needToPay: number; lateFees: number }> {
    const sale = await this.saleRepository.findOne({
      where: {
        code: saleCode,
      },
      relations: {
        payments: true,
        saleItems: true,
      },
      order: {
        payments: {
          id: 'DESC',
        },
      },
    });
    if (sale.paymentStatus === PaymentStatus.PAID)
      throw new BadRequestException('purchase already paid');
    return this.paymentRepository.calculateSaleNeedToPay(sale);
  }
}
