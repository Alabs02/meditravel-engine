import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "@/modules/user/user.module";

import { AuthService } from "./services/auth.service";
import { AuthStrategy } from "@auth/strategy/auth.strategy";
import { FirebaseAuthGuard } from "@core/guards";

@Module({
  controllers: [],
  exports: [FirebaseAuthGuard, AuthService, AuthStrategy],
  imports: [PassportModule, UserModule],
  providers: [AuthService, AuthStrategy, FirebaseAuthGuard]
})
export class AuthModule {}
