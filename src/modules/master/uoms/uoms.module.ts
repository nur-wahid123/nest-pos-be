import { Module } from '@nestjs/common';
import { UomsService } from './uoms.service';
import { UomRepository } from 'src/repositories/uom.repository';
import { UomsController } from './uoms.controller';

@Module({
  providers: [UomsService, UomRepository],
  controllers: [UomsController],
})
export class UomsModule {}
