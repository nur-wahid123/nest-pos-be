import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
  imports: [
    JwtModule.register({
      secret: process.env.USER_KEY_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
})
export class AuthModule {}
