import { Module } from "@nestjs/common";
import { SubsidyService } from "./subsidy.service";
import { SubsidyController } from "./subsidy.controller";
import { MongooseModule } from "@nestjs/mongoose";
import subsidySchema from "src/models/subsidy.schema";
import { Subsidy } from "src/interface/subsidy.interface";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'subsidy',
        schema: subsidySchema,
        collection: "subsidies",
      },
    ]),
  ],
  controllers: [SubsidyController],
  providers: [SubsidyService],
})
export class SubsidyModule {}
