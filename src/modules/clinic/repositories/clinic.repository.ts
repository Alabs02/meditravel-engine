import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Clinic, ClinicDocument } from "../entities/clinic.entity";

@Injectable()
export class ClinicRepository {
  constructor(
    @InjectModel(Clinic.name)
    private readonly clinicModel: Model<ClinicDocument>
  ) {}

  async findAll(): Promise<Partial<Clinic>[]> {
    const results = await this.clinicModel
      .find()
      .select(
        "clinicName clinicSlug location description gallery procedures clinicEstimatedCost usEstimatedCost saving verified rating createdBy isActive createdAt updatedAt"
      )
      .lean({ virtuals: true })
      .exec();

    return results.map(({ _id, ...rest }) => {
      return { ...rest, id: _id };
    });
  }

  async findById(id: string): Promise<Partial<Clinic> | null> {
    const doc = await this.clinicModel.findById(id);
    return doc ? doc.toJSON() : null;
  }

  async findByIdWithDocument(id: string): Promise<ClinicDocument> {
    return this.clinicModel.findById(id).orFail();
  }

  async findBySlug(clinicSlug: string): Promise<ClinicDocument | null> {
    return this.clinicModel.findOne({ clinicSlug });
  }

  async create(data: Partial<Clinic>): Promise<Partial<Clinic>> {
    const created = await this.clinicModel.create(data);
    return created.toJSON();
  }

  async update(id: string, data: Partial<Clinic>): Promise<Partial<Clinic>> {
    const updated = await this.clinicModel
      .findByIdAndUpdate(id, data, { new: true })
      .orFail();
    return updated.toJSON();
  }

  async delete(id: string): Promise<Partial<Clinic>> {
    const deleted = await this.clinicModel.delete({ _id: id });
    return deleted.toJSON();
  }

  async restore(id: string): Promise<void> {
    await this.clinicModel.restore({ _id: id });
  }

  async verify(id: string): Promise<Partial<Clinic>> {
    const verified = await this.clinicModel
      .findByIdAndUpdate(id, { verified: true }, { new: true })
      .orFail();
    return verified.toJSON();
  }

  async count(): Promise<number> {
    return this.clinicModel.countDocuments();
  }

  async paginateAndFilter({
    page = 1,
    limit = 10,
    search = "",
    location,
    procedure,
    minPrice,
    maxPrice
  }: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    procedure?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    results: Partial<Clinic>[];
  }> {
    const query: any = {};

    if (search) {
      query.clinicName = { $regex: search, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (procedure) {
      query["procedures.name"] = { $regex: procedure, $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.clinicEstimatedCost = {};
      if (minPrice !== undefined) query.clinicEstimatedCost.$gte = minPrice;
      if (maxPrice !== undefined) query.clinicEstimatedCost.$lte = maxPrice;
    }

    const [docs, total] = await Promise.all([
      this.clinicModel
        .find(query)
        .select(
          "clinicName clinicSlug location description gallery procedures clinicEstimatedCost usEstimatedCost saving verified rating createdBy isActive createdAt updatedAt"
        )
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean({ virtuals: true }),
      this.clinicModel.countDocuments(query)
    ]);

    return {
      total,
      page,
      limit,
      results: docs.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
    };
  }
}
