import { config } from "dotenv";

config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4200,
  MONGODB_NAME: process.env.MONGODB_NAME ?? "meditravel-db",
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,

  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID!,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!
};
