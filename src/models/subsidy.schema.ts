import mongo from "mongoose";

const subsidySchema = new mongo.Schema({
  serviceId: { type: String, required: true },
  supportType: String,
  serviceName: String,
  servicePurpose: String,
  applicationDeadline: String,
  targetGroup: String,
  selectionCriteria: String,
  supportDetails: String,
  applicationMethod: String,
  requiredDocuments: String,
  receptionInstitutionName: String,
  contactInfo: String,
  onlineApplicationUrl: String,
  lastModified: String,
  responsibleInstitutionName: String,
  administrativeRules: String,
  localRegulations: String,
  law: String,
  supportCondition: Array<String>,
  vectorEmbedding: Array<Number>,
  keywords: Array<String>,
  summary: String,
});

export default mongo.model("subsidy", subsidySchema);