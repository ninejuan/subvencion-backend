import { ExecutionContext } from "@nestjs/common";
import { AuthService } from "src/res/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<any>;
}
export {};
