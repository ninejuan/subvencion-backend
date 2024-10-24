import { Controller, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/res/common/guards/google.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ApplyPropertyDto } from './dto/applyProperty.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(GoogleGuard)
    async googleAuth(@Req() req: Request) {
        return req.user; // google strategy에서 req.user에 user를 지정해줘야 함.
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleAuthRedirect(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = req.user;
        const tokens = await this.authService.handleGoogleLogin(user);

        return { accessToken: tokens.accessToken };
    }

    @Get('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return { message: 'Logged out successfully' };
    }

    @Post('applyProperties')
    @UseGuards(JwtAuthGuard)
    async applyProperties(@Req() req, @Body() applyPropertyDto: ApplyPropertyDto) {
        return this.authService.applyProperties(req.id, applyPropertyDto)
    } 
}
