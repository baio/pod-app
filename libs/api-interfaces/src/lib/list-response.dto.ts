import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// This is common base type for any list response

export class ListPagerDto {
  @ApiProperty({ description: 'page index started with 1', default: 1 })
  page: number;
  @ApiProperty({ description: 'total items count' })
  count: number;
  @ApiProperty({ description: 'items per page' })
  limit: number;
}

export class ListResponseDto<T = any> {
  @ApiProperty({ type: ListPagerDto })
  pager: ListPagerDto;

  @ApiProperty({ description: 'found items' })
  items: T[];
}
