import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Role, RoleSchema } from "@role/entities/role.entity";
import { RoleRepository } from "@role/repositories/role.repository";
import { RoleService } from "@role/services/role.service";
import { RoleController } from "@role/controllers/role.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      }
    ])
  ],
  providers: [RoleRepository, RoleService],
  controllers: [RoleController],
  exports: [RoleService, RoleRepository]
})
export class RoleModule {}
