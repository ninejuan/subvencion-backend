import { Controller, Get, Query, Param, UseGuards, Req, Res } from "@nestjs/common";
import { SubsidyService } from "./newsubsidy.service";
// import { Response } from "express";
import { SubJwtAuthGuard } from "../common/guards/subjwt.guard";

@Controller("subsidies")
export class SubsidyController {
  constructor(private readonly subsidyService: SubsidyService) {}

  @Get('set')
  async setssd() {
    return this.subsidyService.processAllData();
  }

  // 1. 개별 서비스 ID로 보조금 데이터 가져오기
  @UseGuards(SubJwtAuthGuard)
  @Get("detail/:serviceId")
  async getSubsidyByServiceId(@Req() req, @Res() res, @Param("serviceId") serviceId: number) {
    if (!serviceId) {
      throw res.redirect('/');
    }
    let result = this.subsidyService.getDetailedSubsidyData(serviceId, req.id);
    if (!result) {
      throw res.redirect('/404');
    } else return result; 
  }

  // 2. 전체 보조금 목록 가져오기 (페이지네이션)
  @Get("all")
  async getAllSubsidies(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 50
  ) {
    try {
      const subsidies = await this.getAllSubsidies(page, limit);

      return {
        results: subsidies,
      };
    } catch (error) {
      return { message: "Error fetching subsidies", error };
    }
  }

  // 3. 벡터 + 키워드 검색 (하나의 엔드포인트로 통합)
  @Get("search")
  async searchSubsidies(
    @Query("query") query: string
  ) {
    if (!query) {
      return { message: "Query parameter is required" };
    }

    try {
      let result;
        result = await this.subsidyService.searchSubsidiesByVector(
          query
        );
      return result;
    } catch (error) {
      return { message: "Error searching subsidies", error };
    }
  }
}
