import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "@user/entities/user.entity";
import { SoftDeleteModel } from "../types";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>
  ) {}

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ firebaseUid })
      .populate("role")
      .orFail()
      .catch(() => null);
  }

  async createFromFirebasePayload(payload: {
    uid: string;
    email: string;
    name?: string;
    photoUrl?: string;
    isActive?: boolean;
    role: Types.ObjectId | string;
  }): Promise<Partial<User>> {
    const created = await this.userModel.create({
      firebaseUid: payload.uid,
      email: payload.email,
      name: payload.name,
      photoUrl: payload.photoUrl,
      isActive: payload.isActive ?? true,
      role: payload.role
    });

    return created.toJSON();
  }

  async updateUserProfile(
    userId: string | Types.ObjectId,
    dto: Partial<{ name: string; photoUrl: string; roleId: string }>
  ): Promise<Partial<User>> {
    const updates: any = {};

    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.photoUrl !== undefined) updates.photoUrl = dto.photoUrl;
    if (dto.roleId !== undefined) updates.role = new Types.ObjectId(dto.roleId);

    const updated = await this.userModel
      .findByIdAndUpdate(userId, { $set: updates }, { new: true })
      .orFail()
      .populate("role");

    return updated.toJSON();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async countByStatus(isActive: boolean): Promise<number> {
    return this.userModel.countDocuments({ isActive });
  }

  async countSoftDeleted(): Promise<number> {
    return this.userModel.countDocumentsWithDeleted({ isDeleted: true });
  }

  async paginateAndFilter({
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
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    results: Partial<User>[];
  }> {
    const query: any = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        {
          isActive:
            search.toLowerCase() === "active"
              ? true
              : search.toLowerCase() === "inactive"
                ? false
                : undefined
        }
      ].filter(Boolean); // Remove undefined
    }

    if (typeof isActive === "boolean") {
      query.isActive = isActive;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("role")
        .exec(),
      this.userModel.countDocuments(query)
    ]);

    const results = users.map((user) => user.toJSON());

    return {
      total,
      page,
      limit,
      results
    };
  }

  async updateStatus(id: string, isActive: boolean): Promise<Partial<User>> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .orFail()
      .populate("role");

    return updated.toJSON();
  }

  async softDelete(id: string): Promise<Partial<User>> {
    const deleted = await this.userModel.delete({ _id: id });
    return deleted.toJSON();
  }
}
