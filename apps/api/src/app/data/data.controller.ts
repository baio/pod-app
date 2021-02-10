import { Controller, Get, Param } from '@nestjs/common';
import { Message } from '@podgroup/api-interfaces';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  getList() {
    return this.dataService.getList();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.dataService.getOne(id);
  }

}
