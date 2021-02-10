import * as mongoose from 'mongoose';

export const DataSchema = new mongoose.Schema(
  {
    subscriberId: Number,
    status: String,
    usageBytes: Number,
  }
);
