import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export type DataStatus = 'active' | 'inactive' | 'preactive' | 'suspended';

export interface Data {
  _id?: string;
  subscriberId: string;
  status: DataStatus;
  usageBytes: number;
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
  preactive = 'preactive',
  suspended = 'suspended',
}

export class DataDto implements Data {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty({
    example: '111278687',
    description: 'subscriberId is a string and can be started by zero',
    required: true,
  })
  subscriberId: string;

  @ApiProperty({
    example: 'suspended',
    required: true,
    description: 'status could be preactive, active, inactive or suspended',
  })
  @ApiProperty({ example: Status.active, enum: Status })
  status: DataStatus;

  @ApiProperty({
    example: 0,
    required: true,
    description:
      'usageBytes are the bytes used by the subscriber and will be empty if the asset is inactive',
  })
  @IsInt()
  usageBytes: number;
}
