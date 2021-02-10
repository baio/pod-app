import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DataDto } from '@podgroup/api-interfaces';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Return list of data elements' })
  @ApiResponse({ type: DataDto, isArray: true })
  getList() {
    return this.dataService.getList();
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
