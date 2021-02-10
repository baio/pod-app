import * as mongoose from 'mongoose';

export const DataSchema = new mongoose.Schema(
  {
    subscriberId: String,
    status: String,
    usageBytes: Number,
  }
);
