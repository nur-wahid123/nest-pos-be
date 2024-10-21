import { Controller, Get } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
<<<<<<< HEAD
  /**
   * The constructor for the PurchasesController.
   * @param purchasesService The purchases service, which is responsible for performing
   * operations on purchases.
   */
  constructor(private readonly purchasesService: PurchasesService
  ) {
  }

  @Post('create')
  /**
   * Create a new purchase order.
   * @param createPurchaseDto The purchase order information. This should include the supplier id, date, and items.
   * @param payload The user information from the JWT payload.
   * @returns The created purchase order
   */
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.purchasesService.create(createPurchaseDto, +payload.sub, +payload.merchantId);
  }

  @Post('payment')
  /**
   * Pay a purchase order
   * @param paymentDto The payment details. This should include the purchase code, the amount paid, and optionally a note.
   * @param payload The user information from the JWT payload.
   * @returns The created payment
   */
  payment(
    @Payload() payload: JwtPayload,
    @Body() paymentDto: CreatePaymentDto
  ) {
    return this.purchasesService.createPayment(paymentDto, payload?.sub)
  }

  @Get('need-to-pay')
  /**
   * Find out how much is left to pay on a purchase order
   * @param param The purchase code
   * @returns The amount left to pay
   */
  needToPay(@Query() param: { purchase_code: string }) {
    return this.purchasesService.needToPay(param.purchase_code)
  }

  @Get('list')
  /**
   * Find purchase orders matching the given criteria.
   * @param pageOptionsDto The page options. This should include the page number and the number of items per page.
   * @param timeRange The date range to search for purchase orders. This should include the start and end date.
   * @param query The query parameters to search for purchase orders. This can include the supplier id, purchase code, search string, product id, category id, and status.
   * @returns The purchase orders matching the given criteria
   */
  find(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() timeRange: QueryPurchaseDateRangeDto,
    @Query() query: QueryPurchaseListDto,
  ) {
    return this.purchasesService.find(pageOptionsDto, timeRange, query)
=======
  constructor(private readonly purchasesService: PurchasesService) {
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll()
>>>>>>> master
  }
}
