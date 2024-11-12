import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserLoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { Token } from 'src/common/types/token.type';
import { Response } from 'express';
import { Payload } from 'src/common/decorators/payload.decorator';
import { JwtPayload } from './jwt-payload.interface';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() req: UserLoginDto): Promise<Token> {
    return this.authService.login(req);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Payload() payload: JwtPayload) {
    return payload;
  }

  @Delete('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logout Successfull' });
  }
}
