import { Controller, Get, Query, Param } from "@nestjs/common";
import { SubsidyService } from "./newsubsidy.service";

@Controller("subsidies")
export class SubsidyController {
  constructor(private readonly subsidyService: SubsidyService) {}

  @Get('set')
  async setssd() {
    return this.subsidyService.processAllData();
  }

  // 1. 개별 서비스 ID로 보조금 데이터 가져오기
  @Get("detail/:serviceId")
  async getSubsidyByServiceId(@Param("serviceId") serviceId: Number) {
    if (!serviceId) {
      return { message: "Service ID parameter is required" };
    }
    return {};
    // return this.subsidyService.getSubsidyById(serviceId);
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
    @Query("query") query: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    if (!query) {
      return { message: "Query parameter is required" };
    }

    try {
      let result;
        result = await this.subsidyService.searchSubsidiesByVector(
          query,
          page,
          limit
        );
      return result;
    } catch (error) {
      return { message: "Error searching subsidies", error };
    }
  }
}
