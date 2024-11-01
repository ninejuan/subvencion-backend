import { Controller, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/res/common/guards/google.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ApplyPropertyDto } from './dto/applyProperty.dto';
import axios from "axios";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/google')
    @UseGuards(GoogleGuard)
    async googleAuth(@Req() req: Request) {
        return req.user; // google strategy에서 req.user에 user를 지정해줘야 함.
    }

    @Get('/google/redirect')
    @UseGuards(GoogleGuard)
    async googleAuthRedirect(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        console.log('called by remote')
        const user = req.user;
        const tokens = await this.authService.handleGoogleLogin(user);

        response.header(
          "Access-Control-Allow-Origin",
          "https://subvencion.juany.kr"
        );
        response.header("Access-Control-Allow-Credentials", "true");


        return { accessToken: tokens.accessToken };
    }

    @Get('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        return { message: 'Logged out successfully' };
    }

    // 여기에 /mypage에서 표시할 정보 GET Method 작

    @Post('applyProperties')
    @UseGuards(JwtAuthGuard)
    async applyProperties(@Req() req, @Body() applyPropertyDto: ApplyPropertyDto) {
        return this.authService.applyProperties(req.id, applyPropertyDto)
    } 
}
