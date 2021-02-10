import * as mongoose from 'mongoose';

export interface Data extends mongoose.Document<string> {
  subscriberId: string;
  status: string;
  usageBytes: number;
}
