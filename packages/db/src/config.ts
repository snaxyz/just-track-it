import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  url: string;
}

interface Config {
  database: DatabaseConfig;
}

function requireEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(`Required environment variable ${name} is not set`);
  }
  return value;
}

export const config: Config = {
  database: {
    url: requireEnvVariable("DATABASE_URL"),
  },
};
