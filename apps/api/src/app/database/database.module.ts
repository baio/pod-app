import { DynamicModule, Global, Module } from '@nestjs/common';
import { DATABASE_CONNECTION_CONFIG } from './constants';
import {
  DatabaseConnectionConfig,
  databaseProviders,
} from './database.providers';

@Global()
export class DatabaseModule {
  static register(config: DatabaseConnectionConfig): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        ...databaseProviders,
        { provide: DATABASE_CONNECTION_CONFIG, useValue: config },
      ],
      exports: [...databaseProviders],
    };
  }
}
