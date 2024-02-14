import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { RegisterInput, LoginInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtServices: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtServices.sign({ id: userId });
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const user = await this.userService.create(registerInput);

    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { password, email } = loginInput;

    const user = await this.userService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async validatedUser(id: string): Promise<User> {
    const user = await this.userService.findOneByID(id);

    if (user.isBlocked)
      throw new UnauthorizedException('User is blocked, talk with admin');

    // if (!bcrypt.compareSync(user.password, user.password))
    //   throw new UnauthorizedException('Invalid credentials');
    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }
}
