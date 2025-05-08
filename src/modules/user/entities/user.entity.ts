import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  HydratedDocument,
  Types,
  Schema as MongooseSchema,
  model
} from "mongoose";
import { Role } from "@role/entities/role.entity";

@Schema({
  collection: "users",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class User {
  @Prop({ required: true, unique: true, type: String })
  firebaseUid: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Role.name,
    required: false
  })
  role: Types.ObjectId;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  photoUrl?: string;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ default: false, index: true, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(require("mongoose-delete"), {
  deletedAt: true,
  overrideMethods: true
});

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.deletedAt;
    return ret;
  }
});

UserSchema.set("toObject", {
  virtuals: true
});

export const UserModel = model(User.name, UserSchema);

export type UserDocument = HydratedDocument<User>;

export { UserSchema };
