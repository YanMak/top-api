import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel, UserModelSchema } from './models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
