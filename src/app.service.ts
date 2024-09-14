import { Injectable } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { UomsService } from './modules/master/uoms/uoms.service';
import { registerEnumType } from '@nestjs/graphql';
import { Gender } from './entities/user.entity';
import { PaymentStatus } from './entities/purchase.entity';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService, private readonly uomService: UomsService) {

  }

  init() {
    registerEnumType(Gender, {
      name: 'Gender', // This is the name used in GraphQL schema
      description: 'The gender of a user', // Optional description
    });
    registerEnumType(PaymentStatus, {
      name: 'PaymentStatus', // This is the name used in GraphQL schema
      description: 'The Status of Sale', // Optional description
    });
    this.uomService.init()
  }

  getHello(): string {
    return 'Hello World!';
  }
}
