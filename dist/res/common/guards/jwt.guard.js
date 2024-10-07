"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = process.env;
class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService, jwtService) {
        super();
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const isValid = await super.canActivate(context);
        if (!isValid)
            throw new common_1.UnauthorizedException();
        const user = request.user;
        console.log(user ?? undefined);
        return user;
        const payload = { id: user.id };
        request.id = user.id;
    }
}
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map