import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { isAdmin, slugify } from "@/core/utils";
import { ClinicRepository } from "@clinic/repositories/clinic.repository";
import { Clinic } from "@clinic/entities/clinic.entity";
import { UserDocument } from "@/modules/user/entities/user.entity";

@Injectable()
export class ClinicService {
  constructor(private readonly clinicRepo: ClinicRepository) {}

  async findAll(): Promise<Partial<Clinic>[]> {
    return this.clinicRepo.findAll();
  }

  async findById(id: string): Promise<Partial<Clinic>> {
    const clinic = await this.clinicRepo.findById(id);
    if (!clinic) throw new NotFoundException("Clinic not found");
    return clinic;
  }

  async create(data: Partial<Clinic>): Promise<Partial<Clinic>> {
    const slug = slugify(data.clinicName || "");

    const existing = await this.clinicRepo.findBySlug(slug);
    if (existing) {
      throw new ForbiddenException("A clinic with this slug already exists.");
    }

    return this.clinicRepo.create({
      ...data,
      clinicSlug: slug,
      isActive: true,
      verified: false
    });
  }

  async updateWithAccessControl(
    id: string,
    data: Partial<Clinic>,
    user: UserDocument
  ): Promise<Partial<Clinic>> {
    const clinic = await this.clinicRepo.findByIdWithDocument(id);
    const isOwner = clinic.createdBy?.toString() === user._id.toString();

    if (!isOwner && !isAdmin(user)) {
      throw new ForbiddenException(
        "You don't have permission to update this clinic."
      );
    }

    let newSlug = clinic.clinicSlug;

    if (data.clinicName) {
      const generated = slugify(data.clinicName);
      const slugOwner = await this.clinicRepo.findBySlug(generated);

      if (slugOwner && slugOwner._id.toString() !== clinic._id.toString()) {
        throw new ForbiddenException("Another clinic already uses this name.");
      }

      newSlug = generated;
    }

    return this.clinicRepo.update(id, {
      ...data,
      clinicSlug: newSlug
    });
  }

  async deleteWithAccessControl(
    id: string,
    user: UserDocument
  ): Promise<Partial<Clinic>> {
    const clinic = await this.findById(id);
    const isOwner = clinic.createdBy?.toString() === user._id.toString();

    if (!isOwner && !isAdmin(user)) {
      throw new ForbiddenException(
        "You don't have permission to delete this clinic."
      );
    }

    return this.clinicRepo.delete(id);
  }

  async getPaginatedAndFiltered(filters: any): Promise<{
    total: number;
    page: number;
    limit: number;
    results: Partial<Clinic>[];
  }> {
    return this.clinicRepo.paginateAndFilter(filters);
  }

  async restore(id: string): Promise<void> {
    return this.clinicRepo.restore(id);
  }

  async verify(id: string): Promise<Partial<Clinic>> {
    return this.clinicRepo.verify(id);
  }

  async count(): Promise<number> {
    return this.clinicRepo.count();
  }
}
