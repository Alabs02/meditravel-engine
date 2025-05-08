import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { model } from "mongoose";

@Schema({
  collection: "roles",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Role {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({
    required: true,
    enum: ["system", "custom"],
    default: "system",
    type: String
  })
  type: "system" | "custom";

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

RoleSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  }
});

RoleSchema.set("toObject", {
  virtuals: true
});

RoleSchema.plugin(require("mongoose-delete"), {
  deletedAt: true,
  overrideMethods: true
});

export const RoleModel = model(Role.name, RoleSchema);

export type RoleDocument = HydratedDocument<Role>;

export { RoleSchema };
