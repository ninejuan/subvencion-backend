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
  @Get("detail/:serviceId")
// @UseGuards(SubJwtAuthGuard)
async getSubsidyByServiceId(
  @Param("serviceId") serviceId: string, // Capture as string to parse it below
  @Req() req,
  @Res() res
) {
  const parsedServiceId = parseInt(serviceId, 10);
  if (isNaN(parsedServiceId)) {
    return res.status(400).json({ message: "Invalid service ID" });
  }
  
  try {
    const result = await this.subsidyService.getDetailedSubsidyData(parsedServiceId, req.id);
    return res.json(result);
  } catch (error) {
    console.error('Error fetching subsidy details:', error);
    return res.status(500).json({ message: "Failed to fetch subsidy details" });
  }
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
  @UseGuards(SubJwtAuthGuard)
  async searchSubsidies(
    @Req() req,
    @Query("query") query: string
  ) {
    if (!query) {
      return { message: "Query parameter is required" };
    }

    try {
      let result;
        result = await this.subsidyService.searchSubsidiesByVector(
          query, 30, req.id
        );
      // let nes = await this.subsidyService.setIsEligible(req.id, result);
      return result;
    } catch (error) {
      console.error(error);
      return { message: "Error searching subsidies", error };
    }
  }
}
