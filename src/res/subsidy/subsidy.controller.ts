import { Controller, Get, Query, Param } from "@nestjs/common";
import { SubsidyService } from "./subsidy.service";

@Controller("subsidies")
export class subsidyController {
  constructor(private readonly subsidyService: SubsidyService) {}

  // 1. 개별 서비스 ID로 보조금 데이터 가져오기
  @Get("detail/:serviceId")
  async getSubsidyByServiceId(@Param("serviceId") serviceId: Number) {
    if (!serviceId) {
      return { message: "Service ID parameter is required" };
    }
    
    return this.subsidyService.getSubsidyData(serviceId);
  }

  // 2. 전체 보조금 목록 가져오기 (페이지네이션)
  @Get("all")
  async getAllSubsidies(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 50
  ) {
    try {
      const subsidies = await this.subsidyService.subsidyModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const totalCount =
        await this.subsidyService.subsidyModel.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      return {
        results: subsidies,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      return { message: "Error fetching subsidies", error };
    }
  }

  // 3. 벡터 + 키워드 검색 (하나의 엔드포인트로 통합)
  @Get("search")
  async searchSubsidies(
    @Query("query") query: string,
    @Query("keyword") keyword: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    if (!query) {
      return { message: "Query parameter is required" };
    }

    try {
      let result;

      // keyword가 주어지면 벡터 + 키워드 검색을 수행
      if (keyword) {
        result = await this.subsidyService.searchSubsidiesByVectorWithKeyword(
          query,
          keyword,
          page,
          limit
        );
      }
      // keyword가 없으면 벡터 검색만 수행
      else {
        result = await this.subsidyService.searchSubsidiesByVector(
          query,
          page,
          limit
        );
      }

      return result;
    } catch (error) {
      return { message: "Error searching subsidies", error };
    }
  }
}
