import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SubJwtAuthGuard } from './res/common/guards/subjwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(SubJwtAuthGuard)
  @Get('main/interested')
  async getKeyword(@Req() req) {
    return this.appService.getInterestedSubsidies(req.id, 6);
  }

  @Get('main/new')
  async getNew() {
    return this.appService.getNew(6);
  }
}