import { Inject, Injectable } from '@nestjs/common';
import { Message } from '@podgroup/api-interfaces';
import * as mongoose from 'mongoose';
import { DATA_MODEL } from './constants';
import { Data } from './models';

@Injectable()
export class DataService {
  constructor(@Inject(DATA_MODEL) private dataModel: mongoose.Model<Data>) {}

  async getList() {
    const result = await this.dataModel.find().limit(10).exec();
    return result;
  }

  async getOne(id: string) {
    return { id };
  }
}
