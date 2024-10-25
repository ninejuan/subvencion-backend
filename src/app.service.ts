import { Injectable } from "@nestjs/common";
import subsidySchema from "./models/subsidy.schema";
import userSchema from "./models/user.schema";
import { SubsidyService } from "./res/subsidy/newsubsidy.service";

@Injectable()
export class AppService {
  constructor(private readonly subsidyService: SubsidyService) {}
  private async setIsEligible(userEmail: string, subsidies: any) {
    const eligibilityPromises = subsidies.map(async (m) => {
      m.isEligible = await this.subsidyService.checkEligible(userEmail, m.serviceId);
      console.log(m.isEligible);
      return m;
    });

    const newSubsidies = await Promise.all(eligibilityPromises);

    for (let i = 0; i < Math.min(6, newSubsidies.length); i++) {
     console.log(`Subsidy ${i + 1} eligibility:`, newSubsidies[i].isEligible);
    }

    return newSubsidies;
}


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

  async getInterestedSubsidies(userEmail: string, limit: number) {
    // console.log('def gis cal')
    if (!userEmail) return await this.getRandomSubsidies(limit);
    // console.log('service gis userEmail esx');
    const user = await userSchema.findOne({ google_mail: userEmail });
    // console.log(`user keyword data ${user.keywords}`)
    if (!user.keywords || user.keywords.length == 0) {
      // console.log('keyword not esx')
      let subsidies = await this.getRandomSubsidies(limit);
      let result = await this.setIsEligible(userEmail, subsidies);
      return result;
    }
    // console.log('valid keywords')
    const result = await this.getKeywordBasedSubsidies(user.keywords, limit);
    // console.log('keywords result', result);
    return result.length > 0 ? result : await this.getRandomSubsidies(limit);
  }

  async getNew(userEmail: string, limit: number) {
    const subsidies = await subsidySchema.find({}).limit(limit);
    return userEmail ? await this.setIsEligible(userEmail, subsidies) : subsidies;
  }
}
