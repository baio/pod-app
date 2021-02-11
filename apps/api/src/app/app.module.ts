import { Module } from '@nestjs/common';
import { DataModule } from './data';
import { DatabaseModule } from './database';

// tslint:disable:no-var-requires
const envPath = require('path').resolve(
  process.cwd(),
  process.env.ENV_FILE_PATH ||
    `env/${
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? ''
        : process.env.NODE_ENV
    }.env`
);
console.log(
  `NODE_ENV : ${process.env.NODE_ENV}; file ${envPath} will be used for configuration`
);
require('dotenv').config({ path: envPath });

@Module({
  imports: [
    DatabaseModule.register({
      uri: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
    }),
    DataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
