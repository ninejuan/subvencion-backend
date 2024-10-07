"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleGuard = void 0;
const passport_1 = require("@nestjs/passport");
class GoogleGuard extends (0, passport_1.AuthGuard)('google') {
    canActivate(context) {
        return super.canActivate(context);
    }
}
exports.GoogleGuard = GoogleGuard;
//# sourceMappingURL=google.guard.js.map