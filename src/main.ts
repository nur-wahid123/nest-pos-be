import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UserService } from './modules/user/user.service';
import { UomsService } from './modules/master/uoms/uoms.service';
import { registerEnumType } from '@nestjs/graphql';
import { Gender } from './entities/user.entity';
import { PaymentStatus } from './entities/purchase.entity';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = +process.env.APP_PORT || 3000
  const corsDev: string[] = process?.env?.CORS_DEV?.split(',') ?? ['null'];
  const corsStg: string[] = process?.env?.CORS_STG?.split(',') ?? ['null'];
  const appService = app.get(AppService);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: [...corsDev, ...corsStg],
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS'],
  //   credentials: true,
  // });
  appService.init()
  await app.listen(port, () => {
    console.log("listening to port : " + port);
    console.log("url : http://localhost:" + port);
  });

}
bootstrap();
