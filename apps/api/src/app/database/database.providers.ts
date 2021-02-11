import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION, DATABASE_CONNECTION_CONFIG } from './constants';

export interface DatabaseConnectionConfig {
  uri: string;
  dbName: string;
}

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (
      config: DatabaseConnectionConfig
    ): Promise<typeof mongoose> => {
      if (!config.uri || !config.dbName) {
        throw new Error('Connection config uri or dbName is not defined');
      }
      return mongoose.connect(config.uri, {
        dbName: config.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    },
    inject: [DATABASE_CONNECTION_CONFIG],
  },
];
