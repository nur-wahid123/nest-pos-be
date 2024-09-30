import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const startDate = new Date();

    this.logger.log(
      `Request ${method} ${originalUrl} at ${startDate.toISOString()}`,
    );
    this.logger.log(`Request body: ${JSON.stringify(body)}`);

    res.on('finish', () => {
      const finishDate = new Date();
      this.logger.log(
        `Response status: ${res.statusCode} in ${
          finishDate.getTime() - startDate.getTime()
        }ms`,
      );
    });

    next();
  }
}
