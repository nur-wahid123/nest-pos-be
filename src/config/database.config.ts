import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
  } from '@nestjs/typeorm';
  import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
  
  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      let dBlog = false;
      if (process.env.DB_LOG == 'true') {
        dBlog = true;
      }
      return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USERNAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
      };
    },
  };
  