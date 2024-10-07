"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("../../models/user.schema");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async handleGoogleLogin(user) {
        const { email, firstName, lastName, picture, googleId } = user;
        let existingUser = await this.findUserByEmail(email);
        if (!existingUser) {
            console.log('usr not esx');
            const userDto = {
                google_mail: email,
                name: `${lastName} ${firstName}`,
                google_uid: googleId,
                profilePhoto: picture,
            };
            existingUser = await this.createUser(userDto);
        }
        const generatedTokens = await this.generateTokens(existingUser);
        return generatedTokens;
    }
    async generateTokens(user) {
        const payload = { google_id: user.google_uid, google_mail: user.google_mail };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.saveRefreshToken(user.google_mail, refreshToken);
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.findUserByEmail(decoded.email);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async findUserByEmail(email) {
        const user = await user_schema_1.default.findOne({ google_mail: `${email}` });
        return user;
    }
    async createUser(userDto) {
        const newUser = await new user_schema_1.default(userDto).save();
        return newUser;
    }
    async saveRefreshToken(google_mail, refreshToken) {
        const user = await user_schema_1.default.findOne({ google_mail: google_mail });
        user.refreshToken = `${refreshToken}`;
        await user.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map