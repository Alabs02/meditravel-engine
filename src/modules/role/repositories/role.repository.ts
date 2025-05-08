import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "@role/entities/role.entity";

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>
  ) {}

  async findAll(): Promise<Partial<Role>[]> {
    const roles = await this.roleModel.find().exec();
    return roles.map((role) => role.toJSON());
  }

  async findById(id: string): Promise<Partial<Role> | null> {
    const role = await this.roleModel.findById(id);
    return role ? role.toJSON() : null;
  }

  async findByName(name: string): Promise<Partial<Role> | null> {
    const role = await this.roleModel.findOne({ name });
    return role ? role.toJSON() : null;
  }

  async create(role: Partial<Role>): Promise<Partial<Role>> {
    const created = await this.roleModel.create(role);
    return created.toJSON();
  }

  async update(id: string, updates: Partial<Role>): Promise<Partial<Role>> {
    const updated = await this.roleModel
      .findByIdAndUpdate(id, updates, { new: true })
      .orFail();
    return updated.toJSON();
  }

  async softDelete(id: string): Promise<Partial<Role>> {
    const deleted = await this.roleModel.delete({ _id: id });
    return deleted.toJSON();
  }

  async restore(id: string): Promise<void> {
    await this.roleModel.restore({ _id: id });
  }
}
