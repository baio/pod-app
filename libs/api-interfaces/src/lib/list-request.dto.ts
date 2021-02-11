import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, ValidateIf } from 'class-validator';
import { isNil } from 'lodash';
import { getEnumValues } from './utils';

// This is common base type for any list request

export interface IListRequestDto<S extends string = string> {
  page?: number;
  limit?: number;
  sort?: S;
}

export type ListRequestDtoCtor<T extends IListRequestDto> = new (
  sortType: any,
  defaultSort?: { page: number; limit: number }
) => T;

export function ListRequestDto<S extends string = string>(
  sortType: any,
  defaultSort = { page: 1, limit: 25 }
) {
  class ListRequestDtoHost implements IListRequestDto {
    @ApiPropertyOptional({
      type: 'number',
      description: `Page number, starts with ${defaultSort.page}`,
      default: defaultSort.page,
    })
    @ValidateIf((o) => !isNil(o.page))
    readonly page?: number;

    @ApiPropertyOptional({
      type: 'number',
      description: 'Max number of items per page',
      default: defaultSort.limit,
    })
    @ValidateIf((o) => !isNil(o.limit))
    readonly limit?: number;

    @ApiPropertyOptional({
      enum: getEnumValues(sortType),
      description:
        "Order by particular filter, prefix with '-' to search in descent order",
    })
    @Allow()
    @ValidateIf((o) => !isNil(o.sort))
    readonly sort?: S;
  }

  return ListRequestDtoHost as ListRequestDtoCtor<ListRequestDtoHost>;
}
