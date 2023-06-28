import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../module/user/user.service';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Simple checking - more to get the current user instead of doing authentication
    const uId = request.headers['current-user'];
    const user = await this.userService.getOne(`${uId}`);
    if (!user) {
      throw new UnauthorizedException('Unknown user');
    }

    // Attach user to request so router handler doesnt need to retrieve again
    request.user = user;

    return true;
  }
}
