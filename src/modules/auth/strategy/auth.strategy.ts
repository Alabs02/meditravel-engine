import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";

// SERVICES
import { AuthService } from "@auth/services/auth.service";
import { UserService } from "@user/services/user.service";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, "firebase") {
  constructor(
    private readonly firebaseAdmin: AuthService,
    private readonly userService: UserService
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or invalid Authorization header"
      );
    }

    const idToken = authHeader.split(" ")[1];

    try {
      const decoded = await this.firebaseAdmin.verifyToken(idToken);

      // Sync or fetch user from MongoDB
      const user = await this.userService.findOrCreateFirebaseUser(decoded);
      return user; // attaches to req.user
    } catch (err) {
      throw new UnauthorizedException("Invalid Firebase ID token");
    }
  }
}
