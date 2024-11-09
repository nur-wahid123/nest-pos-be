import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UomsModule } from './modules/master/uoms/uoms.module';
import { UomsService } from './modules/master/uoms/uoms.service';
import { UserService } from './modules/user/user.service';
import { UomRepository } from './repositories/uom.repository';
import { UserRepository } from './repositories/user.repository';
import { CitiesModule } from './modules/master/cities/cities.module';
import { SupplierModule } from './modules/master/supplier/supplier.module';
import { BrandsModule } from './modules/master/brands/brands.module';
import { CategoriesModule } from './modules/master/categories/categories.module';
import { ProductsModule } from './modules/master/products/products.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import HashPassword from './common/utils/hash-password.util';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CitiesService } from './modules/master/cities/cities.service';
import { CityRepository } from './repositories/city.repository';
import { ProvinceRepository } from './repositories/province.repository';
import { IslandRepository } from './repositories/island.repository';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { typeOrmAsyncConfig } from './common/configs/database.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '..', 'env', `.env`), '.env'],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule,
    AuthModule,
    UomsModule,
    CitiesModule,
    SupplierModule,
    BrandsModule,
    CategoriesModule,
    ProductsModule,
    PurchasesModule,
    SalesModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [
    UomsService,
    HashPassword,
    UserService,
    UomRepository,
    CityRepository,
    UserRepository,
    AppService,
    CitiesService,
    ProvinceRepository,
    IslandRepository,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
