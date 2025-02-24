import { MongoClient, W } from "mongodb";
import mongoose from "mongoose";
import axios from "axios";
import SubsidyModel from "../../models/subsidy.schema";
import { Subsidy, PaginationResult } from "./types/subsidy.type";
import subsidySchema from "../../models/subsidy.schema";
import userSchema from "src/models/user.schema";
import { config } from "dotenv";
import { NotFoundError } from "rxjs";
import { NotFoundException } from "@nestjs/common";
config();

const {
  MONGODB_URI,
  DATABASE_NAME,
  COLLECTION_NAME,
  GOV24_API_KEY,
  OPENAI_API_KEY,
  KEYWORD_BACKEND_URL,
  MONGO_URI,
} = process.env;

export class SubsidyService {
  private mongoClient: MongoClient;
  private readonly DELAY_MS = 1000;
  private readonly BATCH_SIZE = 10;

  constructor() {
    const options = {
      retryWrites: true,
      w: "majority" as W,
      ssl: true,
      authSource: "admin",
      directConnection: false,
    };
    this.mongoClient = new MongoClient(MONGO_URI, options);
    this.initialize();
  }
  private async initialize() {
    try {
      // MongoDB Native 연결 (벡터 검색용)
      // await this.mongoClient.connect();

      // Mongoose 연결 (일반 CRUD 작업용)
      await console.log(`mongouri : ${MONGO_URI}`);
      await mongoose.connect(MONGO_URI);

      console.log("Connections initialized");
      // await this.createVectorSearchIndex();
    } catch (error) {
      console.error("Error initializing connections:", error);
      throw error;
    }
  }

  // Step 1: 전체 데이터 처리 프로세스
  async processAllData() {
    try {
      // 1. 기존 데이터 전체 삭제
      await this.clearAllData();

      // 2. 기본 정보 및 벡터 저장
      await this.fetchAndStoreBasicInfo();

      // 3. 지원자격 정보 업데이트
      await this.updateAllSupportConditions();

      // 4. 요약 정보 업데이트
      await this.updateAllSummaries();

      console.log("All data processing completed successfully");
    } catch (error) {
      console.error("Error in processAllData:", error);
      throw error;
    }
  }

  private async clearAllData() {
    try {
      await SubsidyModel.deleteMany({});
      console.log("All existing data cleared successfully");
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }

  private async fetchAndStoreBasicInfo() {
    try {
      const firstPageData = await this.fetchSubsidyPage(1, 1);
      // const totalCount = firstPageData.totalCount;
      const totalCount = 6000;
      const perPage = 300; // to 500

      for (let page = 1; page <= Math.ceil(totalCount / perPage); page++) {
        const { data: subsidies } = await this.fetchSubsidyPage(page, perPage);

        for (let i = 0; i < subsidies.length; i += this.BATCH_SIZE) {
          const batch = subsidies.slice(i, i + this.BATCH_SIZE);
          await Promise.all(
            batch.map(async (subsidy: any) => {
              await this.saveBasicSubsidyInfo(subsidy);
            })
          );
          await this.delay(this.DELAY_MS);
        }
        console.log(`Processed page ${page} of basic info`);
      }
    } catch (error) {
      console.error("Error in fetchAndStoreBasicInfo:", error);
      throw error;
    }
  }

  private async updateAllSupportConditions() {
    try {
      // First get the total count from initial request
      const firstPageResponse = await this.fetchSupportCondition("", 1, 1);
      // const totalCount = firstPageResponse.totalCount;
      const totalCount = 10042;
      const perPage = 300; // return to 500
      const totalPages = Math.ceil(totalCount / perPage);

      // Fetch support conditions in batches
      for (let page = 1; page <= totalPages; page++) {
        const response = await this.fetchSupportCondition("", page, perPage);
        const conditions = response.data;

        // Update each subsidy's support conditions
        for (const condition of conditions) {
          const serviceId = condition.서비스ID;
          if (serviceId) {
            const subsidy = await SubsidyModel.findOne({ serviceId });
            if (subsidy) {
              console.log(
                `Updating support condition for service ID: ${serviceId}`
              );
              const supportConditionArray =
                this.extractSupportConditions(condition);
              subsidy.supportCondition = supportConditionArray;
              await subsidy.save();
            }
          }
        }

        // Apply delay between batch requests
        await this.delay(this.DELAY_MS);
        console.log(`Processed page ${page} of ${totalPages}`);
      }
    } catch (error) {
      console.error("Error in updateAllSupportConditions:", error);
      throw error;
    }
  }

  private async updateAllSummaries() {
    try {
      const subsidies = await SubsidyModel.find({});

      for (const subsidy of subsidies) {
        try {
          const summary = await this.summarizeContent(subsidy);
          const keywords = await this.extractKeywords(subsidy);

          subsidy.summary = summary;
          subsidy.keywords = keywords;
          await subsidy.save();
          console.log(
            `updated subsidy ${subsidy.serviceId} with keyword ${keywords}`
          );
          await this.delay(this.DELAY_MS);
        } catch (error) {
          console.error(
            `Error updating summaries for ${subsidy.serviceId}:`,
            error
          );
          continue;
        }
      }
    } catch (error) {
      console.error("Error in updateAllSummaries:", error);
      throw error;
    }
  }

  private async fetchSubsidyPage(page: number, perPage: number) {
    try {
      const response = await axios.get(
        "https://api.odcloud.kr/api/gov24/v3/serviceDetail",
        {
          params: { page, perPage, serviceKey: GOV24_API_KEY },
          headers: { Authorization: GOV24_API_KEY },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching subsidy page ${page}:`, error);
      throw error;
    }
  }

  private async fetchSupportCondition(
    serviceId: string = "",
    page: number = 1,
    perPage: number = 1
  ) {
    try {
      const params: any = {
        page,
        perPage,
        serviceKey: GOV24_API_KEY,
      };

      // Only add service ID filter if specified
      if (serviceId) {
        params["cond[서비스ID::EQ]"] = serviceId;
      }

      const response = await axios.get(
        "https://api.odcloud.kr/api/gov24/v3/supportConditions",
        {
          params,
          headers: { Authorization: GOV24_API_KEY },
        }
      );

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.warn(`Invalid response format for page ${page}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching support conditions for page ${page}:`,
        error
      );
      throw error;
    }
  }

  private async saveBasicSubsidyInfo(subsidyData: any) {
    try {
      const vectorEmbedding = await this.getEmbedding(subsidyData.서비스명);

      const subsidyDoc = new SubsidyModel({
        serviceId: subsidyData.서비스ID,
        supportType: subsidyData.지원유형,
        serviceName: subsidyData.서비스명,
        servicePurpose: subsidyData.서비스목적,
        applicationDeadline: subsidyData.신청기한,
        targetGroup: subsidyData.지원대상,
        selectionCriteria: subsidyData.선정기준,
        supportDetails: subsidyData.지원내용,
        applicationMethod: subsidyData.신청방법,
        requiredDocuments: subsidyData.구비서류,
        receptionInstitutionName: subsidyData.접수기관명,
        contactInfo: subsidyData.문의처,
        onlineApplicationUrl: subsidyData.온라인신청URL,
        lastModified: subsidyData.수정일시,
        responsibleInstitutionName: subsidyData.소관기관명,
        administrativeRules: subsidyData.행정규칙,
        localRegulations: subsidyData.자치법규,
        law: subsidyData.법령,
        supportCondition: [],
        vectorEmbedding,
        keywords: [],
        summary: "",
      });

      await subsidyDoc.save();

      // console.log(
      //   `Basic subsidy data for service ${subsidyDoc.serviceId} saved successfully.`
      // );
    } catch (error) {
      console.error("Error saving basic subsidy data:", error);
      throw error;
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          input: text,
          model: "text-embedding-ada-002",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

  private extractSupportConditions(supportCondition: any): string[] {
    if (!supportCondition) return [];
    let result: string[] = [];
    Object.keys(supportCondition)
      .filter((key) => key.startsWith("JA"))
      .map((key) => {
        if (supportCondition[key] == null || supportCondition[key] == "N") {
        } else {
          console.log(`${key} is appended`);
          result.push(key);
        }
      })
      .filter((condition) => condition != null);
    return result;
  }

  private async summarizeContent(subsidy: any): Promise<string> {
    try {
      const requestBody = {
        serviceId: `${subsidy.serviceId}`,
        content: `${subsidy.supportDetails}` || "",
      };

      const response = await axios.post(
        `${KEYWORD_BACKEND_URL}/summarize_welfare/`, // FastAPI 백엔드의 엔드포인트
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data; // FastAPI 응답에서 데이터를 추출
      console.log(
        `get summarize serviceId ${subsidy.serviceId} smarz ${result}`
      );
      return result || "";
    } catch (error) {
      console.error("Error summarizing content:", error);
      return "";
    }
  }

  private async extractKeywords(subsidy: any): Promise<string[]> {
    try {
      // console.log(`kw be url : ${KEYWORD_BACKEND_URL}`);

      // FastAPI에 전달할 데이터 구조
      const requestBody = {
        serviceId: subsidy.serviceId,
        supportType: subsidy.supportType,
        serviceName: subsidy.serviceName,
        servicePurpose: subsidy.servicePurpose || null, // 선택적 필드를 null로 설정
        applicationDeadline: subsidy.applicationDeadline || null,
        targetGroup: subsidy.targetGroup || null,
        selectionCriteria: subsidy.selectionCriteria || null,
        supportDetails: subsidy.supportDetails || null,
        applicationMethod: subsidy.applicationMethod || null,
        requiredDocuments: subsidy.requiredDocuments || null,
        receptionInstitutionName: subsidy.receptionInstitutionName || null,
        contactInfo: subsidy.contactInfo || null,
        responsibleInstitutionName: subsidy.responsibleInstitutionName || null,
        supportCondition: subsidy.supportCondition || null,
      };

      const response = await axios.post(
        `${KEYWORD_BACKEND_URL}/extract_keywords/`, // FastAPI 백엔드의 엔드포인트
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data; // FastAPI 응답에서 데이터를 추출
      console.log(
        `get keyword serviceId ${subsidy.serviceId} keyword ${result}`
      );
      return result || []; // 키워드 배열 반환
    } catch (error) {
      console.error("Error extracting keywords:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async createVectorSearchIndex() {
    const db = this.mongoClient.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    try {
      const indexes = await collection.listIndexes().toArray();
      const hasVectorIndex = indexes.some(
        (index) => index.name === "subsidy_vector_index"
      );

      if (!hasVectorIndex) {
        /*
          vector atlas vector search index가 존재하지 않을 때 아래 값을 넣어주세요.
          {
  "mappings": {
    "dynamic": true,
    "fields": {
      "vectorEmbedding": {
        "type": "knnVector",
        "dimensions": 1536,  // Ada 모델의 벡터 차원 수
        "similarity": "cosine"
      }
    }
  }
}

        */
        console.log(
          "please create vector embedding atlas search index in mongodb portal"
        );
      } else {
        console.log("Vector search index already exists");
      }
    } catch (error) {
      console.error("Error creating vector search index:", error);
      throw error;
    }
  }

  // 검색 관련 메서드들...
  async searchSubsidiesByVector(
    query: string,
    limit: number = 30,
    userEmail: string,
  ) {
    try {
      const queryVector = await this.getEmbedding(query);

      const db = this.mongoClient.db(DATABASE_NAME);
      const collection = db.collection<Subsidy>(COLLECTION_NAME);
      const pipeline = [
        {
          $vectorSearch: {
            queryVector: queryVector,
            path: "vectorEmbedding",
            numCandidates: 100,
            exact: false,
            limit: 75,
            index: "subsidy_vector_index",
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
            responsibleInstitutionName: 1,
            targetGroup: 1,
            applicationMethod: 1,
            applicationDeadline: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
        {
          $limit: 90,
        },
      ];
      const results = await collection.aggregate<Subsidy>(pipeline).toArray();
      const eligibleCheckedResult = await this.setIsEligible(userEmail, results);
      return eligibleCheckedResult;
    } catch (error) {
      console.error("Error in vector search:", error);
      throw error;
    }
  }

  async close() {
    await Promise.all([this.mongoClient.close(), mongoose.disconnect()]);
  }

  async setIsEligible(userEmail: string, subsidies: any) {
    const eligibilityPromises = subsidies.map(async (m) => {
      m.isEligible = await this.checkEligible(userEmail, m.serviceId);
      console.log(m.isEligible);
      return m;
    });

    const newSubsidies = await Promise.all(eligibilityPromises);

    for (let i = 0; i < Math.min(6, newSubsidies.length); i++) {
     console.log(`Subsidy ${i + 1} eligibility:`, newSubsidies[i].isEligible);
    }

    return newSubsidies;
  }

  async checkEligible(userEmail: string, serviceId: number) {
    const user = await userSchema.findOne({ google_mail: userEmail });
    const subsidy = await subsidySchema.findOne({ serviceId: serviceId });
    if (!subsidy) throw new NotFoundException();
    for (let eligibleCode of user?.jacode || []) {
      if (subsidy?.supportCondition.includes(eligibleCode)) {
        return true;
      } else continue;
    }
    return false;
  }

  async getDetailedSubsidyData(serviceId: number, userEmail: string) {
    const subsidy = await subsidySchema.findOne({ serviceId: serviceId });
    const isEligible = userEmail
      ? this.checkEligible(userEmail, serviceId)
      : false;
    const result = {...subsidy}
      ? {
          ...subsidy,
          isEligible: isEligible,
        }
      : false;
    return result;
  }
}
