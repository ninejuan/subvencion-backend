import { Module } from "@nestjs/common";
import { SubsidyService } from "./newsubsidy.service";
import { SubsidyController } from "./subsidy.controller";
import { MongooseModule } from "@nestjs/mongoose";
import subsidySchema from "src/models/subsidy.schema";

@Module({
  imports: [
    
  ],
  controllers: [SubsidyController],
  providers: [SubsidyService],
})
export class SubsidyModule {}
