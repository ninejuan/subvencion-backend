import { ApiProperty } from "@nestjs/swagger";
export class ApplyPropertyDto {
    @ApiProperty({
        description: "JACode - 복지정보 지원자격요건입니다.",
        example: "[\"복지\"]"
    })
    jacode: Array<String>;

    @ApiProperty({
        description: "키워드 - 관심 키워드입니다.",
        example: "[\"저소득\"]"
    })
    keyword: Array<String>;
};