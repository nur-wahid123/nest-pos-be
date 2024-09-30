import { ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateCityDto } from './dto/create-city.dto';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';


@Controller('cities')
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @Get()
  all() {
    return this.citiesService.findAll()
  }

  @Post()
  create(createCityDto: CreateCityDto, @Payload() payload: JwtPayload) {
    return this.citiesService.create(createCityDto, payload.sub)
  }
}
