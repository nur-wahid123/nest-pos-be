import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateCityDto } from './dto/create-city.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('cities')
@UseGuards(JwtAuthGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  all() {
    return this.citiesService.findAll();
  }

  @Post()
  create(@Body() createCityDto: CreateCityDto, @Payload() payload: JwtPayload) {
    return this.citiesService.create(createCityDto, payload.sub);
  }

  @Post('initcity')
  init(@Body() body: { passwo: string }) {
    if (body.passwo !== 'elkecepatan') {
      throw new BadRequestException('wrong password');
    }
    return this.citiesService.init();
  }
}
