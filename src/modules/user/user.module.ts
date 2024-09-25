import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { UserController } from './user.controller';
import HashPassword from 'src/common/utils/hash-password.util';

@Module({
  providers: [UserService, UserRepository, HashPassword],
  controllers: [UserController],
})
export class UserModule { }
