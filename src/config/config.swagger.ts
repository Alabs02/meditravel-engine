import { SwaggerCustomOptions } from "@nestjs/swagger";

export const SWAGGER_OPTIONS: SwaggerCustomOptions = {
  customfavIcon: "/images/logo.jpg",
  customCssUrl: "/styles/theme-newspaper.css",
  customSiteTitle: "MediTravel API Service Documentation",
  swaggerOptions: {
    persistAuthorization: true
  },
  useGlobalPrefix: true
};

export const SWAGGER_PATH = "/api-docs";
export const SWAGGER_API_VERSION = "1.0";
