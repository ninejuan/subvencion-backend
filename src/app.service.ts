import { Injectable } from "@nestjs/common";
import subsidySchema from "./models/subsidy.schema";
import userSchema from "./models/user.schema";

@Injectable()
export class AppService {
  private async getRandomSubsidies(limit: number) {
    const subsidies = await subsidySchema.aggregate([{ $sample: { size: 6 } }]);
    return subsidies;
  }
  private async getKeywordBasedSubsidies(keywords: string[], limit: number) {
    const subsidies = await subsidySchema
      .find({ keywords: { $in: keywords } })
      .limit(limit);
    return subsidies;
  }

  async getInterestedSubsidies(userId: string, limit: number) {
    if (!userId) return await this.getRandomSubsidies(limit);
    const user = await userSchema.findOne({ google_uid: userId });
    if (!user.keywords || user.keywords.length == 0)
      return await this.getRandomSubsidies(limit);
    return await this.getKeywordBasedSubsidies(user.keywords, limit);
  }

  async getNew(limit: number) {
    const subsidies = await subsidySchema.find({}).limit(limit);
    return subsidies;
  }
}
