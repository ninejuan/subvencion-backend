import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
declare const GoogleGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleGuard extends GoogleGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
