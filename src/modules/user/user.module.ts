import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule { }
