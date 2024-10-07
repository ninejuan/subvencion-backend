import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import { config } from 'dotenv';

config(); const env = process.env;

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET || 'akljkda',
      signOptions: { expiresIn: '30d' }
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}
