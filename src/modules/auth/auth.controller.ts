import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserLoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { Token } from 'src/common/types/token.type';
import { User } from 'src/entities/user.entity';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Query() req: UserLoginDto): Promise<Token> {
    return this.authService.login(req);
  }

  @Post('register')
  register(@Query() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.url;
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logout Successfull' });
  }
}
