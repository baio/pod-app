import { Module } from '@nestjs/common';
import { DataModule } from './data';
import { DatabaseModule } from './database';

@Module({
  imports: [
    DatabaseModule.register({
      uri: 'mongodb://localhost:27017',
      dbName: 'podgroup',
    }),
    DataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
