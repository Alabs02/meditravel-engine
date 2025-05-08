import { Injectable } from "@nestjs/common";
import { UserRepository } from "@/modules/user/repositories/user.repository";
import { ClinicRepository } from "@clinic/repositories/clinic.repository";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import { Types } from "mongoose";
import { CreateUserByAdminDto } from "../dto/admin.dto";
import { AuthService } from "@/modules/auth/services/auth.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepo: UserRepository,
    private readonly clinicRepo: ClinicRepository
  ) {}

  async getAnalytics() {
    const [totalUsers, activeUsers, inactiveUsers, deletedUsers, totalClinics] =
      await Promise.all([
        this.userRepo.count(),
        this.userRepo.countByStatus(true),
        this.userRepo.countByStatus(false),
        this.userRepo.countSoftDeleted(),
        this.clinicRepo.count()
      ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      deletedUsers,
      totalClinics
    };
  }

  async getUsersPaginated({
    page = 1,
    limit = 10,
    search,
    isActive,
    from,
    to
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    from?: string;
    to?: string;
  }) {
    return this.userRepo.paginateAndFilter({
      page,
      limit,
      search,
      isActive,
      from,
      to
    });
  }

  async profileUser(dto: CreateUserByAdminDto) {
    const firebaseUser = await this.authService.createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name
    });

    const newUser = await this.userRepo.createFromFirebasePayload({
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      name: dto.name,
      photoUrl: firebaseUser.photoURL,
      role: new Types.ObjectId(dto.roleId),
      isActive: true
    });

    return newUser;
  }

  async enableUser(id: string) {
    return this.userRepo.updateStatus(id, true);
  }

  async disableUser(id: string) {
    return this.userRepo.updateStatus(id, false);
  }

  async deleteUser(id: string) {
    return this.userRepo.softDelete(id);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.userRepo.updateUserProfile(id, dto);
  }
}
