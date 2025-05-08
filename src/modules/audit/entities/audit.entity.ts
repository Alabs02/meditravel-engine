import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { User } from "@user/entities/user.entity";
import { AuditAction } from "@audit/types";

@Schema({
  collection: "audits",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Audit {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true
  })
  userId: Types.ObjectId;

  @Prop({
    enum: AuditAction,
    required: true,
    type: String
  })
  action: AuditAction;

  @Prop({ default: null, type: String })
  context?: string;

  @Prop({ default: null, type: String })
  ipAddress?: string;

  @Prop({ default: null, type: String })
  userAgent?: string;

  @Prop({ default: null, type: String })
  location?: string;

  @Prop({ default: null, type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: false, index: true, type: Boolean })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

const AuditSchema = SchemaFactory.createForClass(Audit);

AuditSchema.plugin(require("mongoose-delete"), {
  deletedAt: true,
  overrideMethods: true
});

export type AuditDocument = HydratedDocument<Audit>;
export { AuditSchema };
