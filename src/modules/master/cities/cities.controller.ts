import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@Controller('cities')
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }
  @Get()
  all() {
    return this.citiesService.findAll()
  }
}
