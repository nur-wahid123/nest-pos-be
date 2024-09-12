import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = +process.env.APP_PORT || 3000
  const corsDev: string[] = process?.env?.CORS_DEV?.split(',') ?? ['null'];
  const corsStg: string[] = process?.env?.CORS_STG?.split(',') ?? ['null'];
  app.use(cookieParser());
  app.enableCors({
    origin: [...corsDev, ...corsStg],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(port, () => {
    console.log("listening to port : " + port);
    console.log("url : http://localhost:" + port);
  });

}
bootstrap();
