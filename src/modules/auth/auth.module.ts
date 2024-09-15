import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import HashPassword from 'src/common/utils/hash-password.util';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, JwtStrategy, UserService, HashPassword, UserRepository],
  imports: [
    JwtModule.register({
      secret: process.env.USER_KEY_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UserModule,
  ],
  controllers: [AuthController]
})
export class AuthModule { }
