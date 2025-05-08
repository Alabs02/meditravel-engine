import { ENV } from "@/config";
import { ServerApiVersion } from "mongodb";

export const MONGOOSE_CONNECTION_STRING = ENV.MONGODB_URI;

export const MONGOOSE_CONNECTION_OPTIONS = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
};
