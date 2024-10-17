import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UomsService } from './uoms.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomDto } from './dto/update-uom.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';

@Controller('uoms')
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class UomsController {
  constructor(private readonly uomsService: UomsService) {}

  @Get()
  findAll() {
    return this.uomsService.findAll();
  }

  @Post()
  createUom(
    @Body() createUomDto: CreateUomDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.uomsService.create(createUomDto, payload.sub);
  }

  @Put()
  updateUom(
    @Body() updateUomDto: UpdateUomDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.uomsService.update(updateUomDto, payload.sub);
  }

  @Delete(':id')
  deleteUom(@Param() id: number, @Payload() payload: JwtPayload) {
    return this.uomsService.remove(id, payload.sub);
  }
}
