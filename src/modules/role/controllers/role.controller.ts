import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";

import { RoleService } from "@role/services/role.service";
import { CreateRoleDto, UpdateRoleDto } from "@role/dto/role.dto";
import { FirebaseAuthGuard, RolesGuard } from "@core/guards";
import { Roles } from "@core/decorators";
import { ResponseService } from "@shared/response/response.service";

@Controller("roles")
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly response: ResponseService
  ) {}

  @Get()
  async findAll() {
    const roles = await this.roleService.findAll();
    return this.response.success({ data: roles, message: "Roles retrieved" });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const role = await this.roleService.findById(id);
    return this.response.success({ data: role, message: "Role found" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.roleService.create(dto);
    return this.response.success({ data: role, message: "Role created" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("name/:name")
  async findByName(@Param("name") name: string) {
    const role = await this.roleService.findByName(name);
    return this.response.success({ data: role, message: "Role found by name" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    const role = await this.roleService.update(id, dto);
    return this.response.success({ data: role, message: "Role updated" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Delete(":id")
  async softDelete(@Param("id") id: string) {
    const role = await this.roleService.softDelete(id);
    return this.response.success({ data: role, message: "Role soft deleted" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch(":id/restore")
  async restore(@Param("id") id: string) {
    await this.roleService.restore(id);
    return this.response.success({ data: null, message: "Role restored" });
  }
}
