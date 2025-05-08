import "mongoose";

import type {
  Model as MongooseModel,
  Document,
  QueryWithHelpers,
  HydratedDocument,
  Schema,
  InferSchemaType
} from "mongoose";
import type * as MongooseDelete from "mongoose-delete";

export {};

declare global {
  interface Logger {
    log(...messages: any[]): void;
    info(...messages: any[]): void;
    warn(...messages: any[]): void;
    error(...messages: any[]): void;
    debug(...messages: any[]): void;
    success(...messages: any[]): void;

    // Color methods
    red(...messages: any[]): void;
    green(...messages: any[]): void;
    yellow(...messages: any[]): void;
    blue(...messages: any[]): void;
    magenta(...messages: any[]): void;
    cyan(...messages: any[]): void;
    gray(...messages: any[]): void;
    white(...messages: any[]): void;

    // Utility methods
    enable(): void;
    disable(): void;
  }

  var log: Logger;
}

declare module "mongoose" {
  interface Document {
    deleted?: boolean;
    deletedAt?: Date;
  }

  interface Model<
    TRawDocType = any,
    TQueryHelpers = {},
    TInstanceMethods = {},
    TVirtuals = {},
    THydratedDocumentType = HydratedDocument<
      TRawDocType,
      TInstanceMethods,
      TVirtuals
    >,
    TSchemaType = InferSchemaType<Schema>,
    TSchema = any,
    TModelType = MongooseModel<
      TRawDocType,
      TQueryHelpers,
      TInstanceMethods,
      TVirtuals,
      THydratedDocumentType,
      TSchemaType
    >
  > extends MongooseModel<
      TRawDocType,
      TQueryHelpers,
      TInstanceMethods,
      TVirtuals,
      THydratedDocumentType,
      TSchemaType,
      TSchema
    > {
    // mongoose-delete methods
    delete: MongooseDelete.ModelDelete;
    deleteById: MongooseDelete.ModelDeleteById<TRawDocType>;
    restore: MongooseDelete.ModelRestore<TRawDocType>;
    findDeleted: MongooseDelete.ModelFindDeleted<TRawDocType>;
    findWithDeleted: MongooseDelete.ModelFindWithDeleted<TRawDocType>;
  }
}
