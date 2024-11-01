// types.ts
export interface Subsidy {
    serviceId: string;
    supportType: string;
    serviceName: string;
    servicePurpose: string;
    applicationDeadline: string;
    targetGroup: string;
    selectionCriteria: string;
    supportDetails: string;
    applicationMethod: string;
    requiredDocuments: string;
    receptionInstitutionName: string;
    contactInfo: string;
    onlineApplicationUrl: string;
    lastModified: string;
    responsibleInstitutionName: string;
    administrativeRules: string;
    localRegulations: string;
    law: string;
    supportCondition: string[];
    vectorEmbedding: number[];
    keywords: string[];
    summary: string;
  }
  
  export interface PaginationResult<T> {
    results: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }