export interface env_schema {
  NODE_ENV: string;
  PORT: number;
  DATABASE: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  DATABASE_URL: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRATION: number;
  JWT_SALT_ROUNDS: number;
}
