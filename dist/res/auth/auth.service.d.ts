import { JwtService } from '@nestjs/jwt';
import User from 'src/interface/user.interface';
export declare class AuthService {
    private jwtService;
    private readonly logger;
    constructor(jwtService: JwtService);
    handleGoogleLogin(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findUserByEmail(email: String): Promise<import("mongoose").Document<unknown, {}, {
        google_mail: string;
        name: string;
        google_uid: string;
        description: string;
        associated: string;
        profilePhoto: string;
        refreshToken: string;
    }> & {
        google_mail: string;
        name: string;
        google_uid: string;
        description: string;
        associated: string;
        profilePhoto: string;
        refreshToken: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createUser(userDto: User): Promise<User>;
    saveRefreshToken(google_mail: String, refreshToken: string): Promise<void>;
}
