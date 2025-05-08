import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UserDocument } from "@user/entities/user.entity";
import { CurrentUser } from "@core/decorators";
import { FirebaseAuthGuard } from "@core/guards";
import { UpdateUserDto } from "@user/dto/update-user.dto";
import { UserService } from "@user/services/user.service";
import { ResponseService } from "@shared/response/response.service";
import { Types } from "mongoose";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly response: ResponseService
  ) {}

  @ApiBearerAuth("access-token")
  @UseGuards(FirebaseAuthGuard)
  @Get("me")
  getProfile(@CurrentUser() user: UserDocument) {
    return this.response.success({
      message: "User profile retrieved",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        photoUrl: user.photoUrl,
        isDeleted: user.isDeleted
      }
    });
  }

  @ApiBearerAuth("access-token")
  @UseGuards(FirebaseAuthGuard)
  @Patch("me")
  async updateProfile(
    @CurrentUser() user: UserDocument,
    @Body() dto: UpdateUserDto
  ) {
    const updatedUser = await this.userService.update(user._id.toString(), dto);
    const userId = new Types.ObjectId((updatedUser as { id: string }).id);

    return this.response.success({
      message: "User profile updated",
      data: {
        id: userId,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        photoUrl: updatedUser.photoUrl
      }
    });
  }
}
