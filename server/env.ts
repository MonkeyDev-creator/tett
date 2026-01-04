import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  // No .env file found locally — that's fine in production where envs come from the environment.
  // We keep this warning minimal to avoid noisy logs for CI or production.
  // console.warn('.env not found, relying on environment variables');
}

// Ensure a default NODE_ENV for local development when not provided by the shell
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

export {};
