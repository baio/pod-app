import { Inject, Injectable } from '@nestjs/common';
import { IDataListRequestDto } from '@podgroup/api-interfaces';
import * as mongoose from 'mongoose';
import { DATA_MODEL } from './constants';
import { Data } from './models';

@Injectable()
export class DataService {
  constructor(@Inject(DATA_MODEL) private dataModel: mongoose.Model<Data>) {}

  async getList(request: IDataListRequestDto) {
    request = request || {};
    let query = this.dataModel.find(); //.limit(10).exec();
    if (request['filter.status']) {
      query = query.where({
        status: request['filter.status'] as string,
      });
    }
    if (request['filter.subscriberId']) {
      query = query.where({
        subscriberId: { $regex: '.*' + request['filter.subscriberId'] + '.*' },
      });
    }
    if (request['filter.usageBytes']) {
      const range = request['filter.usageBytes'].split(',');
      const from = +range[0];
      const to = +range[1];
      if (from || from === 0) {
        query = query.where({ usageBytes: { $gte: from } });
      }
      if (to || to === 0) {
        query = query.where({ usageBytes: { $lte: to } });
      }
    }
    if (request['sort']) {
      const sort = request['sort'];
      if (sort === 'usageBytes') {
        query = query.sort({ usageBytes: 1 });
      }
      if (sort === '-usageBytes') {
        query = query.sort({ usageBytes: -1 });
      }
    }

    const page = +request['page'] > 0 ? +request['page'] : 1;
    const limit = +request['limit'] > 0 ? +request['limit'] : 25;
    const limitQuery = this.dataModel
      .find()
      .merge(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const countQuery = this.dataModel.count().merge(query);
    const items = await limitQuery.exec();
    const count = await countQuery.exec();

    return {
      items,
      pager: {
        limit,
        page,
        count,
      },
    };
  }

  async getOne(id: string) {
    return { id };
  }
}
