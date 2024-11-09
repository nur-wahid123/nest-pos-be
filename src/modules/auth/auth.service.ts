import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { UserLoginDto } from './dto/login-user.dto';
import { Token } from 'src/common/types/token.type';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import HashPassword from 'src/common/utils/hash-password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly hashPassword: HashPassword,
  ) {}
  register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const user: User = await this.usersService.findByUsername(
      userLoginDto.username,
    );

    if (
      userLoginDto !== undefined &&
      user &&
      (await this.hashPassword.compare(userLoginDto.password, user.password))
    ) {
      const result = user;
      delete result.password;
      return result;
    }
    throw new ForbiddenException('Username Or Password are incorrect');
  }

  async login(dto: UserLoginDto): Promise<Token> {
    const user: User = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new ForbiddenException('Username Or Password are incorrect');
    }

    const payload = await this.validateUser(dto);

    const token = await this.getToken(payload);

    return token;
  }

  async getToken(user: User): Promise<Token> {
    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
      merchantId: user.merchant.id,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.USER_KEY_SECRET,
      expiresIn: '1d',
    });
    return { access_token: token };
  }
}
