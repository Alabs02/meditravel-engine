import { Module } from "@nestjs/common";
import * as MongooseDelete from "mongoose-delete";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
  ENV,
  MONGOOSE_CONNECTION_OPTIONS,
  MONGOOSE_CONNECTION_STRING
} from "@/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ENV],
      envFilePath: [".env"]
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        const connectionString = MONGOOSE_CONNECTION_STRING;
        const dbName = ENV.MONGODB_NAME;

        return {
          uri: connectionString,
          dbName: dbName,
          connectionFactory: (connection) => {
            connection.plugin(MongooseDelete, {
              deletedAt: true,
              overrideMethods: [
                "count",
                "find",
                "findOne",
                "findOneAndUpdate",
                "update"
              ],
              indexFields: ["deleted", "deletedAt"]
            });

            connection.plugin(require("mongoose-autopopulate"));
            return connection;
          },
          ...MONGOOSE_CONNECTION_OPTIONS
        };
      }
    })
  ]
})
export class DatabaseModule {}
