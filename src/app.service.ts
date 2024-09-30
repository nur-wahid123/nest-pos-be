import { Injectable } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { UomsService } from './modules/master/uoms/uoms.service';
import { CitiesService } from './modules/master/cities/cities.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService
    , private readonly uomService: UomsService
    , private readonly cityService: CitiesService
  ) {

  }

  init() {
    this.uomService.init()
    this.cityService.init()
    this.userService.init()
  }

  getHello() {
    return { msg: 'Hello Worldse!' };
  }
}
