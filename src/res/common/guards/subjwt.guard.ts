import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Observable } from "rxjs";
import { config } from 'dotenv';
import { AuthService } from "src/res/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

config();
const env = process.env;

export class SubJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      // JWT 토큰 검증 시도
      const isValid = await super.canActivate(context);
      
      if (isValid) {
        const user = request.user;
        request.id = user?.id || null;
        return true;
      }
    } catch (error) {
      // 토큰이 유효하지 않은 경우
      request.id = undefined;
      return true; // 401 대신 계속 진행
    }

    // 토큰이 없는 경우
    request.id = undefined;
    return true;
  }
}