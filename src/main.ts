import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const port: number = +process.env.APP_PORT || 3000;
  const appService = app.get(AppService);
  app.use(cookieParser());
  const corsDev: string[] = process?.env?.CORS_DEV?.split(',') ?? ['null'];
  const corsStg: string[] = process?.env?.CORS_STG?.split(',') ?? ['null'];
  app.enableCors({
    origin: [...corsDev, ...corsStg],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS'],
    credentials: true,
  });
  appService.init();
  await app.listen(port, () => {
    new Logger('WEB').log(`http://localhost:${port}`);
    new Logger('CORS-DEV').log(`${corsDev}`);
    new Logger('CORS-STG').log(`${corsStg}`);
    console.log('Halobro');
  });
}
bootstrap();
