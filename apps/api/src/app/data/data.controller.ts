import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  DataDto,
  DataListRequestDto,
  DataListResponseDto,
  ListResponseDto,
} from '@podgroup/api-interfaces';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Return list of data elements' })
  @ApiQuery({ type: DataListRequestDto })
  @ApiResponse({ type: ListResponseDto })
  getList(
    @Query() requestDto: DataListRequestDto
  ): Promise<DataListResponseDto> {
    return this.dataService.getList(requestDto);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Return single data element by id' })
  @ApiResponse({ type: DataDto })
  getOne(@Param('id') id) {
    return this.dataService.getOne(id);
  }
}
