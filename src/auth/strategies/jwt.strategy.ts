import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  //async validate({ id }: IJWTPayload) {
  async validate({ email }: Pick<UserModel, 'email'>) {
    console.log('async validate({ id }: IJWTPayload) {');
    console.log(email);
    return email;
  }

  /*async validate(payload: any) {
		console.log(payload)
	}*/
}
