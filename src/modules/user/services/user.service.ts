import { Injectable } from "@nestjs/common";
import { DecodedIdToken } from "firebase-admin/auth";
import { Types } from "mongoose";
import { User, UserDocument } from "@user/entities/user.entity";
import { UserRepository } from "@user/repositories/user.repository";
import { UpdateUserDto } from "@user/dto/update-user.dto";
import { RoleService } from "@role/services/role.service";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RoleService
  ) {}

  async findOrCreateFirebaseUser(
    decoded: DecodedIdToken
  ): Promise<UserDocument> {
    const existing = await this.userRepo.findByFirebaseUid(decoded.uid);
    if (existing) return existing;

    const totalUsers = await this.userRepo.count();
    const roleName = totalUsers === 0 ? "admin" : "user";
    const role = await this.roleService.findByName(roleName);

    const roleId = new Types.ObjectId((role as { id: string }).id);

    await this.userRepo.createFromFirebasePayload({
      uid: decoded.uid,
      email: decoded.email!,
      name: decoded.name,
      isActive: true,
      role: roleId,
      photoUrl: decoded.picture
    });

    const created = await this.userRepo.findByFirebaseUid(decoded.uid);
    if (!created) throw new Error("Failed to create or retrieve user");

    return created;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<Partial<User>> {
    return this.userRepo.updateUserProfile(userId, dto);
  }
}
