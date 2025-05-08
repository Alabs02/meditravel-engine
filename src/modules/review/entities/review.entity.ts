import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { Clinic } from "@clinic/entities/clinic.entity";
import { User } from "@user/entities/user.entity";

@Schema({
  collection: "reviews",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Review {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Clinic.name,
    required: true,
    index: true
  })
  clinicId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true
  })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5, type: Number })
  rating: number;

  @Prop({ required: false, trim: true, type: String })
  comment?: string;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ default: false, index: true, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ default: null, type: String })
  ipAddress?: string;

  @Prop({ default: null, type: String })
  userAgent?: string;
}

const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.plugin(require("mongoose-delete"), {
  deletedAt: true,
  overrideMethods: true
});

export type ReviewDocument = HydratedDocument<Review>;
export { ReviewSchema };
