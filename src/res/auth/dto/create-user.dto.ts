import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
    @ApiProperty({
        description: "유저의 Google E-mail Address입니다. 가입 시 사용합니다.",
        example: "juan.lee@octive.net"
    })
    google_mail!: string;

    @ApiProperty({
        description: "유저의 닉네임입니다. 기본적으로 Google display_name 속성이 설정됩니다.",
        example: "주안 이"
    })
    nickname: string;

    @ApiProperty({
        description: "유저 소개글입니다. 기본적으로 비어있는 값을 저장합니다.",
        example: "선린인터넷고등학교에서 소프트웨어 개발을 전공하고 있는 이주안입니다."
    })
    description?: string;

    @ApiProperty({
        description: "유저의 소속입니다. 기본적으로 무소속으로 저장됩니다.",
        example: "Octive"
    })
    associated?: string;

    @ApiProperty({
        description: "유저의 프로필 사진입니다. 변경이 불가하며, 구글 계정의 프로필 사진이 지정됩니다.",
        example: "https://example.com/google_profile.png"
    })
    profilePhoto: string;

    @ApiProperty({
        description: "유저의 refresh Token입니다.",
        example: "kfjhf84h8f="
    })
    refreshToken: string;
}