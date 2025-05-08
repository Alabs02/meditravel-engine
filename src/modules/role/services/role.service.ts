import { Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@role/entities/role.entity"; // ⬅ Use the base class now
import { RoleRepository } from "@role/repositories/role.repository";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  findAll(): Promise<Partial<Role>[]> {
    return this.roleRepo.findAll();
  }

  findById(id: string): Promise<Partial<Role>> {
    return this.roleRepo.findById(id).then((role) => {
      if (!role) throw new NotFoundException("Role not found");
      return role;
    });
  }

  async findByName(name: string): Promise<Partial<Role>> {
    const role = await this.roleRepo.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role "${name}" not found`);
    }
    return role;
  }

  create(data: Partial<Role>): Promise<Partial<Role>> {
    return this.roleRepo.create(data);
  }

  update(id: string, data: Partial<Role>): Promise<Partial<Role>> {
    return this.roleRepo.update(id, data);
  }

  softDelete(id: string): Promise<Partial<Role>> {
    return this.roleRepo.softDelete(id);
  }

  restore(id: string): Promise<void> {
    return this.roleRepo.restore(id);
  }
}
