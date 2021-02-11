import { DataDto } from '@podgroup/api-interfaces';
import * as mongoose from 'mongoose';

export interface DataDoc extends mongoose.Document<string>, DataDto {}
