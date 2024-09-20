import { Injectable } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { UomsService } from './modules/master/uoms/uoms.service';
import { Gender } from './entities/user.entity';
import { PaymentStatus } from './entities/purchase.entity';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService, private readonly uomService: UomsService) {

  }

  init() {
    this.uomService.init()
    this.userService.init()
  }

  getHello(): string {
    return 'Hello Worldse!';
  }
}
