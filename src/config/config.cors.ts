export const CORS_OPTIONS = {
  origin: "*", // use your actual frontend URL(s) in production
  methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-API-Version"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range", "X-RateLimit-Remaining"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export const CORS_OPTIONS_DEV = {
  ...CORS_OPTIONS,
  credentials: true
};

export const CORS_OPTIONS_PROD = {
  ...CORS_OPTIONS,
  credentials: false
};
