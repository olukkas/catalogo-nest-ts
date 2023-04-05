import * as Joi from 'joi';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Schemas {
  export type DB_SCHEMA_TYPE = {
    DB_VENDOR: 'mysql' | 'sqlite';
    DB_HOST: string;
    DB_DATABASE: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_LOGGING: boolean;
    DB_AUTO_LOAD_MODELS: boolean;
  };

  function requiredWhenMySQL(schema: Joi.Schema): any {
    return schema.when('DB_VENDOR', {
      is: 'mysql',
      then: Joi.required(),
    });
  }

  export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
    DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
    DB_HOST: Joi.string().required(),
    DB_DATABASE: requiredWhenMySQL(Joi.string()),
    DB_USERNAME: requiredWhenMySQL(Joi.string()),
    DB_PASSWORD: requiredWhenMySQL(Joi.string()),
    DB_PORT: requiredWhenMySQL(Joi.number().integer()),
    DB_LOGGING: Joi.boolean().required(),
    DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
  };
}
