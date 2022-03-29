import { Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { TestdataService } from './testdata.service';

@Controller('testdata')
export class TestdataController {
  constructor(private readonly testDataService: TestdataService) {}

  @Get('recruit')
  async putTestData(): Promise<Boolean> {
    // Logger.log('controll : ', Number(datalength));
    return this.testDataService.putTestData(41);
  }
}
