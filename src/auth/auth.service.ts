import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './models/user.model';
import { AuthDto } from './dtos/auth.dto';
import {
  USER_ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { genSaltSync, hashSync, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSaltSync(10);
    const oldUser = await this.userModel.findOne({ email: dto.login });
    if (!oldUser) {
      const newUser = await this.userModel.create({
        email: dto.login,
        passwordHash: await hashSync(dto.password, salt),
      });
      return newUser.save();
    } else {
      throw new BadRequestException(USER_ALREADY_REGISTERED_ERROR);
    }
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(
      password,
      (await user).passwordHash,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string): Promise<{ access_token: string }> {
    const payload = { email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
