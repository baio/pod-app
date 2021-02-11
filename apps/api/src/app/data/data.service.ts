import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Data, IDataListRequestDto } from '@podgroup/api-interfaces';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { DATA_MODEL } from './constants';
import { DataDoc } from './models';

@Injectable()
export class DataService {
  constructor(@Inject(DATA_MODEL) private dataModel: mongoose.Model<DataDoc>) {}

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
      } else if (sort === '-usageBytes') {
        query = query.sort({ usageBytes: -1 });
      } else if (sort === 'status') {
        query = query.sort({ status: 1 });
      } else if (sort === '-status') {
        query = query.sort({ status: -1 });
      } else if (sort === 'subscriberId') {
        query = query.sort({ subscriberId: 1 });
      } else if (sort === '-subscriberId') {
        query = query.sort({ subscriberId: -1 });
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
    try {
      const res = await this.dataModel.findById(new ObjectID(id)).exec();
      return res.toJSON();
    } catch {
      // This is oversimplistic
      throw new NotFoundException();
    }
  }

  async create(data: Data) {
    const res = await this.dataModel.create(data);
    return res.toJSON();
  }

  async update(id: string, data: Data) {
    try {
      const res = await this.dataModel.findByIdAndUpdate(
        new ObjectID(id),
        data,
        {
          useFindAndModify: false,
        }
      );
      return res.toJSON();
    } catch (e) {
      // This is oversimplistic
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      const res = await this.dataModel.findByIdAndRemove(new ObjectID(id));
      return res.toJSON();
    } catch {
      // This is oversimplistic
      throw new NotFoundException();
    }
  }
}
