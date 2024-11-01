import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SubJwtAuthGuard } from './res/common/guards/subjwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(SubJwtAuthGuard)
  @Get('main/interested')
  async getKeyword(@Req() req) {
    console.log('int cal')
    return this.appService.getInterestedSubsidies(req.id ?? null, 6);
  }

  @UseGuards(SubJwtAuthGuard)
  @Get('main/new')
  async getNew(@Req() req) {
    console.log('new cal')
    return this.appService.getNew(req.id, 6);
  }
}