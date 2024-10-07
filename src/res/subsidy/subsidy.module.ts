import { Module } from '@nestjs/common';
import { SubsidyService } from './subsidy.service';
import { SubsidyController } from './subsidy.controller';

@Module({
  controllers: [SubsidyController],
  providers: [SubsidyService],
})
export class SubsidyModule {}
