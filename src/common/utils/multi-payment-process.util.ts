import { EntityManager } from 'typeorm';
import { codeFormaterWithOutLocation } from './auto-generate-code.util';
import { Payment } from 'src/entities/payment.entity';

export async function autoGenerateCodeBank(
  date: Date,
  queryRunner: EntityManager,
  secondPrefix?: string,
): Promise<string> {
  const newDate = new Date(date).toISOString();
  const lastRecord = await queryRunner
    .createQueryBuilder(Payment, 'payment')
    .where('DATE(payment.createdAt) = :date', { date: newDate })
    .andWhere('payment.code ILIKE :code', {
      code: `${secondPrefix}%`,
    })
    .select('payment.code')
    .setLock('pessimistic_write')
    .orderBy('payment.createdAt', 'DESC')
    .useTransaction(true)
    .getOne();
  console.log(lastRecord);

  return await codeFormaterWithOutLocation(
    secondPrefix ?? 'PJ',
    date,
    lastRecord ? lastRecord.code : null,
  );
}
