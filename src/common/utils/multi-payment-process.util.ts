import { BadRequestException } from '@nestjs/common';

import { EntityManager, In, QueryRunner } from 'typeorm';
import {
  codeFormater,
  codeFormaterWithOutLocation,
  increaseSequenceVal,
} from './auto-generate-code.util';
import { Payment } from 'src/entities/payment.entity';

export async function autoGenerateCodeBank(
  date: Date,
  queryRunner: EntityManager,
  secondPrefix?: string,
): Promise<string> {
  const newDate = new Date(date).toDateString();
  const lastRecord = await queryRunner
    .createQueryBuilder(Payment, 'payment')
    .where('payment.date = :date', { date: newDate })
    .andWhere('payment.code ILIKE :code', {
      code: `${secondPrefix}%`,
    })
    .orderBy('payment.code', 'DESC')
    .useTransaction(true)
    .getOne();
  return await codeFormaterWithOutLocation(
    secondPrefix ?? 'PJ',
    date,
    lastRecord ? lastRecord.code : null,
  );
}

// export async function autoGenerateCodeBankPay(
//   queryRunner: EntityManager,
//   fisrtPrefix: string,
//   infix: string,
//   date: Date,
// ) {
//   const newDate = new Date(date).toDateString();
//   const lastRecord = await queryRunner
//     .createQueryBuilder(BankPay, 'bankPay')
//     .where('bankPay.date = :date', { date: newDate })
//     .andWhere('bankPay.number ILIKE :number', {
//       number: `${fisrtPrefix}/${infix}%`,
//     })
//     .orderBy('bankPay.number', 'DESC')
//     .useTransaction(true)
//     .getOne();
//   return await codeFormater(
//     fisrtPrefix,
//     infix,
//     date,
//     lastRecord ? lastRecord.number : null,
//   );
// }

// export async function autoGenerateCode(
//   prefix: string,
//   date: Date,
//   queryRunner?: EntityManager,
// ): Promise<string> {
//   const newDate = new Date(date).toDateString();
//   const lastRecord = await queryRunner
//     .createQueryBuilder(Payment, 'payment')
//     .where('payment.date = :date', { date: newDate })
//     .andWhere('payment.code ILIKE :code', { code: `ET/${prefix}%` })
//     .orderBy('payment.id', 'DESC')
//     .useTransaction(true)
//     .setLock('pessimistic_read')
//     .getOne();

//   return await codeFormater(
//     'ET',
//     prefix,
//     date,
//     lastRecord ? lastRecord?.code : null,
//   );
// }

// export function mapingPaymentItems(
//   reducedPaymentItems: CreatePaymentItemDto[],
//   sales: Sale[],
//   userId: number,
// ) {
//   const mapedPaymentItems = reducedPaymentItems.map((items) => {
//     const sale = sales.find((v) => v.id === items.saleId);
//     if (!sale) {
//       throw new BadRequestException([`sale not found`]);
//     }
//     const paymentItem = new PaymentItem();
//     paymentItem.sale = sale;
//     paymentItem.subTotal = 0;
//     paymentItem.createdBy = userId;

//     return paymentItem;
//   });
//   return mapedPaymentItems;
// }

// export async function mapingAndStoreBankPay(
//   queryRunner: QueryRunner,
//   mapedPaymentDetails: PaymentDetail[],
//   paymentType: PaymentType,
//   date: Date,
//   sales: Sale[],
// ) {
//   const currBankPayCode: string[] = [];
//   await Promise.all(
//     mapedPaymentDetails.map(async (v, i) => {
//       let bank = v?.paymentMethod?.bank;
//       if (v?.bank) {
//         bank = v?.bank;
//       }
//       if (v.paymentMethod.paymentMethodType.code === 'CASH') {
//         let bankPayCode = await autoGenerateCodeBankPay(
//           queryRunner.manager,
//           BankPayType.BKM,
//           bank?.infix,
//           date,
//         );
//         if (currBankPayCode.find((code) => code === bankPayCode)) {
//           bankPayCode = increaseSequenceVal(bankPayCode, i);
//         }

//         currBankPayCode.push(bankPayCode);
//         const bankPay = new BankPay();
//         bankPay.type = BankPayType.BKM;
//         bankPay.isDownPayment =
//           paymentType == PaymentType.DOWNPAYMENT ? true : false;
//         bankPay.payment = v.payment;
//         bankPay.number = bankPayCode;
//         bankPay.amount = v.subTotal;
//         bankPay.bank = bank;
//         bankPay.date = date;
//         bankPay.paymentDetail = v;
//         bankPay.note = `PEMBAYARAN: ${v?.payment?.code}`;

//         await queryRunner.manager.save(bankPay);
//         bankPay.bankPayItems = v?.transactionPaid.map((salesPaid) => {
//           const sale = sales.find((sale) => sale.id === salesPaid.id);
//           const bankPayItems = new BankPayItem();
//           bankPayItems.bankPay = bankPay;
//           bankPayItems.isMain = true;
//           bankPayItems.subAmount = salesPaid?.paid;
//           bankPayItems.bankTransaction = sale?.bankTransactions.find(
//             (bankTransaction) => {
//               return paymentType == PaymentType.DOWNPAYMENT
//                 ? bankTransaction.isDownPayment === true
//                 : bankTransaction.isMain === true;
//             },
//           );

//           return bankPayItems;
//         });
//         await queryRunner.manager.save(bankPay.bankPayItems);
//         return bankPay;
//       }
//       return;
//     }),
//   );
// }

// export function summaryOfSales(sales: Sale[]) {
//   //sum  total sale
//   const totalSales = sales.reduce(
//     (sum, item) => Number(sum) + Number(item.total),
//     0,
//   );

//   //sum of dp  total sale
//   const totalDownPayment = sales.reduce(
//     (sum, item) => Number(sum) + Number(item.downPayment),
//     0,
//   );

//   //sum of returned
//   const totalReturned = sales.reduce(
//     (sum, item) => Number(sum) + Number(item.returned),
//     0,
//   );

//   //sum of returned
//   const totalDelFee = sales.reduce(
//     (sum, item) => Number(sum) + Number(item.deliveryFee),
//     0,
//   );

//   //sum total sale paid
//   const totalSalesPaid = sales.reduce(
//     (sum, item) => Number(sum) + Number(item.paid),
//     0,
//   );
//   return {
//     totalSales,
//     totalSalesPaid,
//     totalDownPayment,
//     totalReturned,
//     totalDelFee,
//   };
// }

// export async function validation(
//   queryRunner: QueryRunner,
//   reducedPaymentItems: CreatePaymentItemDto[],
//   paymentDetails: CreatePaymentDetailDto[],
//   customerId?: number,
// ) {
//   //find customer for payment
//   const customer = await queryRunner.manager.findOne(Customer, {
//     where: { id: customerId, active: true },
//     relations: { memberCard: true },
//     transaction: true,
//   });
//   if (!customer) throw new BadRequestException([`customer not found`]);

//   const masterBankTransactions = await queryRunner.manager.find(
//     MasterBankTransaction,
//     {
//       where: {
//         code: In(['PPNOUT', 'SALESPAY', 'INCDELIV', 'DPPAY']),
//       },
//       transaction: true,
//     },
//   );

//   // get ppn out
//   const ppnOut = masterBankTransactions.find((v) => v.code === 'PPNOUT');
//   if (!ppnOut) throw new BadRequestException([`PPNOUT not found`]);

//   // get sale pay
//   const salePay = masterBankTransactions.find((v) => v.code === 'SALESPAY');
//   if (!salePay) throw new BadRequestException([`SALESPAY not found`]);

//   // get INCDELIV pay
//   const incdeliv = masterBankTransactions.find((v) => v.code === 'INCDELIV');
//   if (!incdeliv) throw new BadRequestException([`INCDELIV not found`]);

//   // get DPPAY pay
//   const dppay = masterBankTransactions.find((v) => v.code === 'DPPAY');
//   if (!incdeliv) throw new BadRequestException([`DPPAY not found`]);

//   // find sale for paymentItems
//   const sales = await queryRunner.manager.find(Sale, {
//     where: { id: In(reducedPaymentItems.map((v) => v.saleId)) },
//     transaction: true,
//     relations: { bankTransactions: true, customer: true },
//   });

//   // find edc for payment detail
//   const edcs = await queryRunner.manager.find(Edc, {
//     where: { id: In(paymentDetails.map((v) => v.edcId)) },
//     relations: { paymentFees: true },
//     transaction: true,
//   });

//   // find banks for payment detail
//   const banks = await queryRunner.manager.find(Bank, {
//     where: { id: In(paymentDetails.map((v) => v.bankId)), isActive: true },
//     transaction: true,
//   });

//   // find payment for payment detail
//   const paymentMethods = await queryRunner.manager.find(PaymentMethod, {
//     where: { id: In(paymentDetails.map((v) => v.paymentMethodId)) },
//     relations: { paymentMethodType: true, bank: true },
//     transaction: true,
//   });

//   return {
//     customer,
//     ppnOut,
//     salePay,
//     dppay,
//     incdeliv,
//     sales,
//     edcs,
//     banks,
//     paymentMethods,
//   };
// }

// export function mapingPaymentDetais(
//   paymentDetails: CreatePaymentDetailDto[],
//   paymentMethods: PaymentMethod[],
//   edcs: Edc[],
//   banks: Bank[],
//   mapedPaymentItems: PaymentItem[],
//   date: Date,
//   userId: number,
// ) {
//   let globalCharge = 0;
//   const maxPaymentDetailsIndex = paymentDetails.length - 1;
//   const mapedPaymentDetails = paymentDetails.map((paymentDetail, index) => {
//     // checking if the charge not in last payment details
//     if (index < maxPaymentDetailsIndex && globalCharge > 0) {
//       throw new BadRequestException([
//         `you only need one payment method for this section`,
//       ]);
//     }

//     //checking payment method
//     const paymentMethod = paymentMethods.find(
//       (v) => v.id === paymentDetail.paymentMethodId,
//     );
//     if (!paymentMethod)
//       throw new BadRequestException([`payment method not found`]);

//     //checking edc
//     let edc: Edc;
//     if (paymentDetail.edcId) {
//       edc = edcs.find((v) => v.id === paymentDetail.edcId);
//       if (!edc) throw new BadRequestException([`edc not found`]);
//     }

//     let bank: Bank;
//     if (paymentDetail.bankId) {
//       bank = banks.find((v) => v.id === paymentDetail.bankId);
//       if (!bank) throw new BadRequestException([`bank not found`]);
//     }

//     //define paid and haspaid
//     const surcharge = paymentDetail?.surchargeInValue ?? 0;
//     let paid = Number(paymentDetail.paid) - Number(surcharge);
//     let hasPaid = 0;

//     //sum  total sale
//     const totalSales = mapedPaymentItems.reduce(
//       (sum, item) => Number(sum) + Number(item?.sale.total),
//       0,
//     );

//     //sum total sale paid
//     const totalSalesPaid = mapedPaymentItems.reduce(
//       (sum, item) => Number(sum) + Number(item?.sale.paid),
//       0,
//     );
//     //sum total sale paid
//     const totalDownPayment = mapedPaymentItems.reduce(
//       (sum, item) => Number(sum) + Number(item?.sale.downPayment),
//       0,
//     );
//     //sum total sale paid
//     const totalReturned = mapedPaymentItems.reduce(
//       (sum, item) => Number(sum) + Number(item?.sale.returned),
//       0,
//     );

//     //sum total sale paid
//     const totalDelfee = mapedPaymentItems.reduce(
//       (sum, item) => Number(sum) + Number(item?.sale.deliveryFee),
//       0,
//     );

//     const haveToPays =
//       Number(totalSales) +
//       Number(totalDelfee) -
//       Number(totalSalesPaid) -
//       Number(totalDownPayment) -
//       Number(totalReturned);

//     // logic fir charge
//     let charge = paid - haveToPays;
//     if (charge < 0) {
//       charge = 0;
//     } else {
//       // increment the golbal charge for first logic
//       globalCharge = globalCharge + charge;
//     }

//     /**
//      * maping the payment items  (updating the value util the process end)
//      */

//     const transactionPaid: Array<{ id: number; paid: number }> = [];
//     mapedPaymentItems.map((paymentItem) => {
//       if (paid !== 0) {
//         const sale = paymentItem?.sale;
//         const haveToPay =
//           Number(sale?.total) +
//           Number(sale?.deliveryFee) -
//           Number(sale?.downPayment) -
//           Number(sale?.paid) -
//           Number(sale?.returned);
//         if (haveToPay > 0) {
//           if (paid >= haveToPay) {
//             sale.paid = Number(sale.paid) + Number(haveToPay);
//             if (sale.isProcessed == false) {
//               throw new BadRequestException([
//                 'the down payment cannot be more than sale in total',
//               ]);
//             }
//             sale.paymentStatus = PaymentStatus.PAID;
//             paymentItem.subTotal =
//               Number(paymentItem.subTotal) + Number(haveToPay);
//             paid = Number(paid) - Number(haveToPay);
//             hasPaid = Number(hasPaid) + Number(haveToPay);
//             transactionPaid.push({ id: sale.id, paid: haveToPay });
//           } else {
//             if (sale.isProcessed == false) {
//               sale.paid = Number(sale.paid);
//               sale.downPayment = Number(sale.downPayment) + Number(paid);
//             } else {
//               sale.paid = Number(sale.paid) + Number(paid);
//             }
//             sale.paymentStatus = PaymentStatus.PARTIALPAID;
//             paymentItem.subTotal = Number(paymentItem.subTotal) + Number(paid);
//             hasPaid = Number(hasPaid) + Number(paid);
//             transactionPaid.push({ id: sale.id, paid: paid });
//             paid = 0;
//           }
//         }
//       }
//       return paymentItem;
//     });

//     let isConfirmed = true;
//     if (paymentMethod.paymentMethodType.code != 'CASH') {
//       isConfirmed = false;
//     }
//     const newPaymentDetail = new PaymentDetail();
//     newPaymentDetail.cardNumber = paymentDetail?.cardNumber;
//     newPaymentDetail.edc = edc;
//     newPaymentDetail.bank = bank ?? paymentMethod?.bank;
//     newPaymentDetail.paymentMethod = paymentMethod;
//     newPaymentDetail.paid = paymentDetail.paid;
//     newPaymentDetail.subTotal = hasPaid + surcharge;
//     newPaymentDetail.charge = charge;
//     newPaymentDetail.surchargeInPercent = paymentDetail?.surchargeInPercent;
//     newPaymentDetail.surcharge = surcharge;
//     newPaymentDetail.isBalance = false;
//     newPaymentDetail.isConfirmed = isConfirmed;
//     newPaymentDetail.createdBy = userId;
//     newPaymentDetail.date = date;
//     newPaymentDetail.confirmationDate = isConfirmed ? date : null;
//     newPaymentDetail.transactionPaid = transactionPaid;
//     return newPaymentDetail;
//   });

//   return { globalCharge, mapedPaymentDetails };
// }

// // reduce payment items
// export function reduceDublicatePaymentItem(data: CreatePaymentItemDto[]) {
//   return Object.values(
//     data.reduce((acc, items) => {
//       if (acc[items.saleId]) {
//         acc[items.saleId].saleId = items.saleId;
//       } else {
//         acc[items.saleId] = { ...items };
//       }
//       return acc;
//     }, {} as { [saleId: number]: CreatePaymentItemDto }),
//   );
// }
