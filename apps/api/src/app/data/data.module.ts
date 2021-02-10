import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DataController } from './data.controller';
import { dataProviders } from './data.providers';
import { DataService } from './data.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DataController],
  providers: [
    DataService,
    ...dataProviders,
  ],
})
export class DataModule {}