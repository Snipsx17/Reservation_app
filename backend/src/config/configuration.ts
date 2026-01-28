import * as Joi from 'joi';
import { env_schema } from './config.interface';

export default {
  validationSchema: Joi.object<env_schema>({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development')
      .required(),
    PORT: Joi.number().default(4000).required(),
    DATABASE: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION: Joi.number().required(),
  }),
  isGlobal: true,
  envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
};
