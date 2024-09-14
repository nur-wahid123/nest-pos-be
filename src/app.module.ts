import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UomsModule } from './modules/master/uoms/uoms.module';
import { UomsService } from './modules/master/uoms/uoms.service';
import { UserService } from './modules/user/user.service';
import { UomRepository } from './repositories/uom.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy()
    }),

    UserModule,
    AuthModule,
    UomsModule,
  ],
  providers: [UomsService, UserService, UomRepository, UserRepository, AppService]
})
export class AppModule { }
