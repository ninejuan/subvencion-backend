import { AuthService } from './auth.service';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(req: Request): Promise<Express.User>;
    googleAuthRedirect(req: Request, response: Response): Promise<{
        accessToken: string;
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
