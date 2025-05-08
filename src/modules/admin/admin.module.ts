import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AdminService } from "@admin/services/admin.service";
import { AdminController } from "@admin/controllers/admin.controller";

import { User, UserSchema } from "@/modules/user/entities/user.entity";
// import { UserRepository } from "@/modules/user/repositories/user.repository";

import { Clinic, ClinicSchema } from "@/modules/clinic/entities/clinic.entity";
// import { ClinicRepository } from "@clinic/repositories/clinic.repository";
import { ClinicModule } from "@clinic/clinic.module";
import { UserModule } from "@user/user.module";
import { RoleModule } from "../role/role.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    UserModule,
    ClinicModule,

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Clinic.name, schema: ClinicSchema }
    ])
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
