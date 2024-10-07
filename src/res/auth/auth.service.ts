import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/interface/user.interface';
import userSchema from 'src/models/user.schema';
import { JwtPayload } from 'src/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService
    ) { }

    async handleGoogleLogin(user: any) {
        // console.log(user);
        const { email, firstName, lastName, picture, googleId } = user;

        let existingUser: User = await this.findUserByEmail(email);
        if (!existingUser) {
            console.log('usr not esx')
            const userDto: User = {
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

    async generateTokens(user: User) {
        const payload: JwtPayload = { google_id: user.google_uid, google_mail: user.google_mail };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

        return { accessToken: accessToken };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.findUserByEmail(decoded.email);

            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async findUserByEmail(email: String) {
        const user = await userSchema.findOne({ google_mail: `${email}` });
        return user;
    }

    async createUser(userDto: User): Promise<User> {
        const newUser = await new userSchema(userDto).save();
        return newUser;
    }
}
