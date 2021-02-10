import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DataStatus, Status } from './data-model';
import { IListRequestDto, ListRequestDto } from './list-request.dto';
import { getEnumValues } from './utils';

export enum DataOrder {
  createdAt = 'usageBytes',
  reverseCreatedAt = '-usageBytes',
}

export type DataListOrder = 'usageBytes' | '-usageBytes';

export interface IDataListRequestDto extends IListRequestDto<DataListOrder> {
  'filter.subscriberId'?: string;
  'filter.status'?: DataStatus;
  'filter.usageBytes'?: string;
}

export class DataListRequestDto
  extends ListRequestDto<DataListOrder>(DataOrder)
  implements IDataListRequestDto {
  @ApiPropertyOptional({
    description: 'Filter by subscriber id',
  })
  @IsOptional()
  readonly 'filter.subscriberId'?: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: Status.suspended,
    enum: getEnumValues(Status),
    description: 'Filter by status',
  })
  @IsEnum(Status)
  readonly 'filter.status'?: DataStatus;

  @IsOptional()
  @ApiPropertyOptional({
    example: '0,50000',
    description: 'Filter by usageBytes range',
  })
  readonly 'filter.usageBytes'?: string;
}
