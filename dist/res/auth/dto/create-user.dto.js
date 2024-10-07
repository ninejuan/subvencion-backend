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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAuthDto {
}
exports.CreateAuthDto = CreateAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저의 Google E-mail Address입니다. 가입 시 사용합니다.",
        example: "juan.lee@octive.net"
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "google_mail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저의 닉네임입니다. 기본적으로 Google display_name 속성이 설정됩니다.",
        example: "주안 이"
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저 소개글입니다. 기본적으로 비어있는 값을 저장합니다.",
        example: "선린인터넷고등학교에서 소프트웨어 개발을 전공하고 있는 이주안입니다."
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저의 소속입니다. 기본적으로 무소속으로 저장됩니다.",
        example: "Octive"
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "associated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저의 프로필 사진입니다. 변경이 불가하며, 구글 계정의 프로필 사진이 지정됩니다.",
        example: "https://example.com/google_profile.png"
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "profilePhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저의 refresh Token입니다.",
        example: "kfjhf84h8f="
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=create-user.dto.js.map