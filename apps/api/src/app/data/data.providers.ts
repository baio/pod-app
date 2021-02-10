import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database';
import { DATA_MODEL, DATA_MODEL_NAME } from './constants';
import { DataSchema } from './schemas';

export const dataProviders = [
  {
    provide: DATA_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(DATA_MODEL_NAME, DataSchema, DATA_MODEL_NAME),
    inject: [DATABASE_CONNECTION],
  },
];
