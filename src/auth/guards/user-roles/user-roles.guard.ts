import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly refletor: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const valiDRoles: string[] = this.refletor.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!valiDRoles) return true;
    if (valiDRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    for (const role of user.roles) {
      if (valiDRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${valiDRoles}]`,
    );
  }
}
