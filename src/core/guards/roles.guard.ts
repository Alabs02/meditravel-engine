import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@core/decorators";
import { UserDocument } from "@/modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: UserDocument = request.user;

    const userRole = (user.role as any)?.name || user.role?.toString();

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException("Insufficient role to access this resource");
    }

    return true;
  }
}
