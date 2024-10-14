import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('main/keyword')
  async getKeyword() {
    return this.appService.getKeyword();
  }

  @Get('main/new')
  async getNew() {
    return this.appService.getNew();
  }
}