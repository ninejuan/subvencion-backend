import { Global, Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./res/auth/auth.module";
import { SubsidyModule } from "./res/subsidy/subsidy.module";
import { SubsidyService } from "./res/subsidy/newsubsidy.service";

@Global()
@Module({
  imports: [ConfigModule.forRoot(), PassportModule, AuthModule, SubsidyModule],
  controllers: [AppController],
  providers: [AppService, SubsidyService, Logger],
})
export class AppModule {}
