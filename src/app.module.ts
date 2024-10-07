import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './res/auth/auth.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger
  ],
})
export class AppModule {}
