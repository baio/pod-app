import { DataDto } from '@podgroup/api-interfaces';
import * as mongoose from 'mongoose';

export interface Data extends mongoose.Document<string>, DataDto {}
