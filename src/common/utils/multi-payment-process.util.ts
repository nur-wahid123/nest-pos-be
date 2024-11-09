import { EntityManager } from 'typeorm';
import { codeFormaterWithOutLocation } from './auto-generate-code.util';
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
    .setLock('pessimistic_write')
    .orderBy('payment.code', 'DESC')
    .useTransaction(true)
    .getOne();
  return await codeFormaterWithOutLocation(
    secondPrefix ?? 'PJ',
    date,
    lastRecord ? lastRecord.code : null,
  );
}
