import * as Joi from 'joi';
import { env_schema } from './config.interface';

export default {
  validationSchema: Joi.object<env_schema>({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development')
      .required(),
    PORT: Joi.number().default(4000).required(),
  }),
  isGlobal: true,
};
