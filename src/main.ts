require("module-alias/register");
import "reflect-metadata";
import "@core/log";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import {
  ENV,
  CORS_OPTIONS_DEV,
  CORS_OPTIONS_PROD,
  SWAGGER_API_VERSION,
  SWAGGER_OPTIONS,
  SWAGGER_PATH
} from "@/config";
import { HttpExceptionFilter } from "@core/filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("MediTravel API Service")
    .setDescription(
      "The journey to your beauty – Top-Rated Clinics, Affordable Prices"
    )
    .setVersion(SWAGGER_API_VERSION)
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header"
      },
      "access-token"
    )
    .addServer("/api")
    .addTag("MediTravel Core Service")
    .addGlobalParameters({
      name: "X-API-Version",
      in: "header",
      required: true,
      schema: {
        type: "string",
        default: "1"
      }
    })
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
    extraModels: [],
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true
  });

  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory, {
    ...SWAGGER_OPTIONS
  });

  app.setGlobalPrefix("/api");

  app.enableCors({
    origin: "*" // ! Remember: To adjust settings appropriately for the production environment
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalFilters(app.get(HttpExceptionFilter));

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "X-API-Version",
    defaultVersion: "1"
  });

  await app.listen(ENV.PORT);

  log.cyan(`[MULTISITE] -> App is running on: http://127.0.0.1:${ENV.PORT}`);
}
bootstrap();
