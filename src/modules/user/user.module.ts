import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./services/user.service";
import { User, UserSchema } from "./entities/user.entity";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repositories/user.repository";
import { RoleModule } from "../role/role.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),

    RoleModule
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService, UserRepository] // needed so other modules (e.g., Auth) can use it
})
export class UserModule {}
