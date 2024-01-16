/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from './../user/user.service';
import { User } from './../../DB/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:'coolcode',
    });
  }

  async validate(payload: any):Promise<User> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }

    return user;
  }
}
