import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  DataDto,
  DataListRequestDto,
  DataListResponseDto,
  ListResponseDto,
} from '@podgroup/api-interfaces';
import { ObjectID } from 'mongodb';
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
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id) {
    return this.dataService.getOne(id);
  }

  @Post()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Create new item' })
  @ApiBody({ type: DataDto })
  @ApiResponse({ type: DataDto })
  create(@Body() data: DataDto) {
    return this.dataService.create(data);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update item' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: DataDto })
  @ApiResponse({ type: DataDto })
  update(@Param('id') id, @Body() data: DataDto) {
    return this.dataService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Delete item' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id) {
    return this.dataService.remove(id);
  }
}
