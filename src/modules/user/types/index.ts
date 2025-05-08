import { Model } from "mongoose";

export interface SoftDeleteModel<T> extends Model<T> {
  countDocumentsWithDeleted(filter?: any): Promise<number>;
}
