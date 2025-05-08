import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  Put,
  Body,
  UseGuards,
  Post
} from "@nestjs/common";
import { AdminService } from "@admin/services/admin.service";
import { FirebaseAuthGuard, RolesGuard } from "@/core/guards";
import { Roles } from "@/core/decorators";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import { ResponseService } from "@shared/response/response.service";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CreateUserByAdminDto } from "../dto/admin.dto";

@ApiBearerAuth("access-token")
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly response: ResponseService
  ) {}

  @Get("analytics")
  async getAnalytics() {
    const data = await this.adminService.getAnalytics();
    return this.response.success({ data, message: "Analytics retrieved" });
  }

  @Get("users")
  @ApiQuery({ name: "page", required: true })
  @ApiQuery({ name: "limit", required: true })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  @ApiQuery({ name: "from", required: false, type: String }) // ISO date string
  @ApiQuery({ name: "to", required: false, type: String }) // ISO date string
  async getUsers(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("isActive") isActive?: boolean,
    @Query("from") from?: string,
    @Query("to") to?: string
  ) {
    const data = await this.adminService.getUsersPaginated({
      page,
      limit,
      search,
      isActive,
      from,
      to
    });

    return this.response.success({
      data,
      message: "Users retrieved successfully"
    });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("users")
  async profileUserByAdmin(@Body() dto: CreateUserByAdminDto) {
    const user = await this.adminService.profileUser(dto);

    return this.response.success({
      data: user,
      message: "User profiled successfully"
    });
  }

  @Patch("users/:id/enable")
  async enableUser(@Param("id") id: string) {
    const data = await this.adminService.enableUser(id);
    return this.response.success({ data, message: "User enabled" });
  }

  @Patch("users/:id/disable")
  async disableUser(@Param("id") id: string) {
    const data = await this.adminService.disableUser(id);
    return this.response.success({ data, message: "User disabled" });
  }

  @Delete("users/:id")
  async deleteUser(@Param("id") id: string) {
    const data = await this.adminService.deleteUser(id);
    return this.response.success({ data, message: "User deleted" });
  }

  @Put("users/:id")
  async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    const data = await this.adminService.updateUser(id, dto);
    return this.response.success({ data, message: "User updated" });
  }
}
