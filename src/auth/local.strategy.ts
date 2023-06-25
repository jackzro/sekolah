import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const userLogin = {
      email,
      password,
    };
    const user = await this.authService.validateUser(userLogin);
    if (user.message) {
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
