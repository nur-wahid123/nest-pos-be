import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import {
  CreatePurchaseDto,
  CreatePurchaseItemDto,
} from './dto/create-purchase.dto';
import { SupplierRepository } from 'src/repositories/supplier.repository';
import { PurchaseItem } from 'src/entities/purchase-item.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { In } from 'typeorm';
import { GetPurchaseWithUserDto } from './dto/get-purchase-with-user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { QueryDateRangeDto } from '../../common/dto/query-purchase-date-range.dto';
import { QueryPurchaseListDto } from './dto/query-purchase-list.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { Purchase } from 'src/entities/purchase.entity';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly purchaseRepo: PurchaseRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}
  findAll() {
    this.purchaseRepo.find({
      relations: { supplier: true, payments: true, purchaseItems: true },
    });
  }

  async create(
    createPurchaseDto: CreatePurchaseDto,
    userId: number,
    merchantId: number,
  ): Promise<GetPurchaseWithUserDto> {
    const supplier = await this.supplierRepository.findById(
      createPurchaseDto.supplierId,
    );
    if (!supplier) throw new BadRequestException(`supplier not found`);

    const reducedPurchaseItems = this.reduceDublicateProduct(
      createPurchaseDto.purchaseItems,
    );

    const newPurchaseItems = await this.mapPurchaseItems(reducedPurchaseItems);

    const total = newPurchaseItems.reduce(
      (sum, purchaseItems) => sum + purchaseItems.subTotal,
      0,
    );
    const result = await this.purchaseRepo.createPurchase(
      createPurchaseDto,
      newPurchaseItems,
      supplier,
      total,
      userId,
      merchantId,
    );
    return await this.findOne(result.id);
  }

  private reduceDublicateProduct(
    data: CreatePurchaseItemDto[],
  ): CreatePurchaseItemDto[] {
    return Object.values(
      data.reduce(
        (acc, purchaseItem) => {
          if (acc[purchaseItem.product_id]) {
            acc[purchaseItem.product_id].qty += purchaseItem.qty;
          } else {
            acc[purchaseItem.product_id] = { ...purchaseItem };
          }
          return acc;
        },
        {} as { [product_id: number]: CreatePurchaseItemDto },
      ),
    );
  }

  private async mapPurchaseItems(
    data: CreatePurchaseItemDto[],
  ): Promise<PurchaseItem[]> {
    //purchaseItems
    const productIds = data.map((item) => item.product_id);
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }
    return data.map((v) => {
      const { qty, buy_price } = v;
      const purchaseItem = new PurchaseItem();
      const product = products.find((product) => product?.id == v?.product_id);
      purchaseItem.qty = qty;
      purchaseItem.buyPrice = buy_price;
      purchaseItem.subTotal = buy_price * qty;
      purchaseItem.product = product;
      return purchaseItem;
    });
  }

  async findOne(id: number): Promise<GetPurchaseWithUserDto> {
    const purchase = await this.purchaseRepo.findOne({ where: { id } });
    if (!purchase) throw new NotFoundException('purchase  not found');
    const response = new GetPurchaseWithUserDto();
    Object.assign(response, purchase);
    response.createdByUser = await this.userRepository.findOneBy({
      id: response.createdBy,
    });
    return response;
  }

  async find(
    pageOptionsDto: PageOptionsDto,
    timeRange: QueryDateRangeDto,
    query: QueryPurchaseListDto,
  ) {
    const data = this.purchaseRepo.findAll(pageOptionsDto, timeRange, query);
    const itemCount = await data.getCount();
    const entities = await data.getMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async createPayment(paymentDto: CreatePaymentDto, userId: number) {
    return this.paymentRepository.payPurchase(paymentDto, userId);
  }

  async needToPay(purchaseCode: string): Promise<number> {
    const purchase = await this.purchaseRepo.findOne({
      where: {
        code: purchaseCode,
      },
      relations: {
        payments: true,
        purchaseItems: true,
      },
      order: {
        payments: {
          id: 'DESC',
        },
      },
    });
    if (purchase.paymentStatus === PaymentStatus.PAID)
      throw new BadRequestException('purchase already paid');
    return this.paymentRepository.calculatePurchaseNeedToPay(purchase);
  }
}
