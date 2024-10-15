import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import subsidySchema from "../../models/subsidy.schema";
import axios from "axios";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { config } from "dotenv";
config();

const { GOV24_API_KEY, OPENAI_API_KEY } = process.env;

@Injectable()
export class SubsidyService {
  private readonly logger = new Logger(SubsidyService.name);

  constructor(
    @InjectModel(subsidySchema.name)
    private subsidyModel: Model<typeof subsidySchema>
  ) {}

  @Cron("0 5 * * *") // 매일 오전 5시에 실행
  async fetchAndStoreSubsidies() {
    try {
      const firstPageData = await this.fetchSubsidyPage(1, 1);
      const totalCount = firstPageData.totalCount;
      const perPage = 500;

      // 페이지별 데이터 처리
      for (let page = 1; page <= Math.ceil(totalCount / perPage); page++) {
        const { data: subsidies } = await this.fetchSubsidyPage(page, perPage);
        const serviceIds = subsidies.map((subsidy: any) => subsidy.서비스ID);

        // 병렬로 각 서비스의 지원조건 가져오기 및 데이터 저장
        await Promise.all(
          subsidies.map(async (subsidy) => {
            const supportCondition = await this.fetchSupportCondition(
              subsidy.서비스ID
            );
            await this.saveSubsidyWithConditions(subsidy, supportCondition);
          })
        );
      }
    } catch (error) {
      console.error("Error in fetchAndStoreSubsidies:", error);
    }
  }

  // 보조금 페이지 데이터 가져오기
  async fetchSubsidyPage(page: number, perPage: number) {
    try {
      const response = await axios.get(
        `https://api.odcloud.kr/api/gov24/v3/serviceDetail`,
        {
          params: { page, perPage },
          headers: { Authorization: GOV24_API_KEY },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching subsidy page ${page}:`, error);
      throw error;
    }
  }

  // 개별 서비스 지원조건 데이터를 가져오기
  async fetchSupportCondition(serviceId: string) {
    try {
      const response = await axios.get(
        `https://api.odcloud.kr/api/gov24/v3/supportConditions`,
        {
          params: {
            "cond[서비스ID]": serviceId, // 개별 서비스 ID로 요청
            page: 1,
            perPage: 1,
          },
          headers: { Authorization: GOV24_API_KEY },
        }
      );
      return response.data.data[0];
    } catch (error) {
      console.error(
        `Error fetching support condition for serviceId ${serviceId}:`,
        error
      );
      throw error;
    }
  }

  // 보조금 데이터 저장 및 임베딩 생성
  async saveSubsidyWithConditions(subsidy: any, supportCondition: any) {
    try {
      const vectorEmbedding = await this.getEmbedding(subsidy.서비스명);
      const supportConditionArray =
        this.extractSupportConditions(supportCondition);

      // 핵심 키워드 추출
      const keywords = await this.extractKeywords(subsidy.서비스명);

      // 지원금 내용 요약
      const summary = await this.summarizeContent(subsidy.지원내용);

      const subsidyData = new subsidySchema({
        serviceId: subsidy.서비스ID,
        serviceName: subsidy.서비스명,
        servicePurpose: subsidy.서비스목적,
        applicationDeadline: subsidy.신청기한,
        targetGroup: subsidy.지원대상,
        selectionCriteria: subsidy.선정기준,
        supportDetails: subsidy.지원내용,
        applicationMethod: subsidy.신청방법,
        requiredDocuments: subsidy.구비서류,
        supportCondition: supportConditionArray,
        vectorEmbedding,
        keywords, // 새로 추가된 필드
        summary, // 새로 추가된 필드
      });

      await subsidyData.save();
      console.log(
        `Subsidy data for service ${subsidy.서비스ID} saved successfully.`
      );
    } catch (error) {
      console.error("Error saving subsidy schema with embedding:", error);
      throw error;
    }
  }

  // 지원자격요건 배열 생성
  extractSupportConditions(supportCondition: any): string[] {
    return Object.keys(supportCondition)
      .filter((key) => key.startsWith("JA"))
      .map((key) => supportCondition[key]);
  }

  // OpenAI 임베딩 생성
  async getEmbedding(query: string): Promise<number[]> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        { input: query, model: "text-embedding-ada-002" },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error("Error fetching embedding:", error);
      throw error;
    }
  }

  // 핵심 키워드 추출
  async extractKeywords(content: string): Promise<string[]> {
    try {
      const response = await axios.post(
        "http://localhost:5000/generate",
        {
          prompt: `Extract 15 key keywords from the following content: ${content}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.split(",").map((keyword: string) => keyword.trim());
    } catch (error) {
      console.error("Error extracting keywords:", error);
      return [];
    }
  }

  // 지원금 내용 요약
  async summarizeContent(content: string): Promise<string> {
    try {
      const response = await axios.post(
        "http://localhost:5000/generate",
        {
          prompt: `Summarize the following content in 30 characters or less: ${content}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.trim();
    } catch (error) {
      console.error("Error summarizing content:", error);
      return "";
    }
  }

  async searchSubsidiesByVector(
    query: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const queryVector = await this.getEmbedding(query);
      const skip = (page - 1) * limit;

      const results = await this.subsidyModel
        .aggregate([
          {
            $search: {
              index: "subsidy_vector_index",
              knnBeta: {
                vector: queryVector,
                path: "vectorEmbedding",
                k: 100, // Retrieve more results for better pagination
              },
            },
          },
          {
            $project: {
              _id: 0,
              serviceId: 1,
              serviceName: 1,
              servicePurpose: 1,
              supportDetails: 1,
              keywords: 1,
              summary: 1,
              score: { $meta: "searchScore" },
            },
          },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec();

      const totalCount = await this.subsidyModel.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      return {
        results,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error("Error in vector search:", error);
      throw error;
    }
  }

  async searchSubsidiesByVectorWithKeyword(
    query: string,
    keyword: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const queryVector = await this.getEmbedding(query);
      const skip = (page - 1) * limit;

      const results = await this.subsidyModel
        .aggregate([
          {
            $search: {
              index: "subsidy_vector_index",
              compound: {
                must: [
                  {
                    knnBeta: {
                      vector: queryVector,
                      path: "vectorEmbedding",
                      k: 100, // Retrieve more results for better pagination
                    },
                  },
                  {
                    text: {
                      query: keyword,
                      path: "keywords",
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              serviceId: 1,
              serviceName: 1,
              servicePurpose: 1,
              supportDetails: 1,
              keywords: 1,
              summary: 1,
              score: { $meta: "searchScore" },
            },
          },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec();

      const totalCount = await this.subsidyModel.countDocuments({
        keywords: keyword,
      });
      const totalPages = Math.ceil(totalCount / limit);

      return {
        results,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error("Error in vector search with keyword:", error);
      throw error;
    }
  }

  async getSubsidyData(serviceId: Number) {
    const subsidyData = await subsidySchema.findOne({ serviceId: serviceId });
    return subsidyData;
  }

  async getAllSubsidydata(page: number, limit: number) {
    
  }
}
