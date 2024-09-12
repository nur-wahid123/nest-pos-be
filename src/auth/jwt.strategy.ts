import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayload } from '../modules/auth/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Use cookies or authorization header
      secretOrKey: process.env.USER_KEY_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return this.usersService.viewUser(payload.sub);
  }
}
