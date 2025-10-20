import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const methodRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    const classRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getClass());
    const requiredRoles = methodRoles ?? classRoles;

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) throw new UnauthorizedException('User not found in request');
    if (!user.role)
      throw new UnauthorizedException('User role not found in JWT payload');

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole)
      throw new ForbiddenException('You do not have permission for this action');

    return true;
  }
}
