import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  HydratedDocument,
  Types,
  Schema as MongooseSchema,
  model
} from "mongoose";
import { User } from "@user/entities/user.entity";

export class ClinicProcedure {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  amount: number;
}

@Schema({
  collection: "clinics",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Clinic {
  @Prop({ required: true, type: String })
  clinicName: string;

  @Prop({ required: true, unique: true, type: String })
  clinicSlug: string;

  @Prop({ required: true, type: String })
  location: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: [ClinicProcedure], default: [] })
  procedures: ClinicProcedure[];

  @Prop({ type: Number })
  clinicEstimatedCost?: number;

  @Prop({ type: Number })
  usEstimatedCost?: number;

  @Prop({ type: Number })
  saving?: number;

  @Prop({ default: false, type: Boolean })
  verified: boolean;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: false
  })
  createdBy: Types.ObjectId;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ default: false, index: true, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

const ClinicSchema = SchemaFactory.createForClass(Clinic);

// ClinicSchema.virtual("reviewCount", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "clinicId",
//   count: true
// });

ClinicSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ClinicSchema.plugin(require("mongoose-delete"), {
  deletedAt: true,
  overrideMethods: true
});

ClinicSchema.index({
  clinicName: "text",
  location: "text",
  "procedures.name": "text"
});

ClinicSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
    return ret;
  }
});

ClinicSchema.set("toObject", {
  virtuals: true
});

ClinicSchema.index({ clinicEstimatedCost: 1 });
ClinicSchema.index({ verified: 1 });
ClinicSchema.index({ createdAt: -1 });

export const ClinicModel = model(Clinic.name, ClinicSchema);

export type ClinicDocument = HydratedDocument<Clinic>;
export { ClinicSchema };
