export interface Lead {
  id: string;
  fullName: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyResearch {
  name: string;
  description: string;
  websiteTitle: string;
  metaDescription: string;
  headings: string[];
  services: string[];
  technologies: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  performance: {
    lighthouse?: number;
    mobileFriendly?: boolean;
  };
}

export interface BusinessAudit {
  businessOverview: string;
  websiteAudit: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  uxAnalysis: {
    usability: string;
    designQuality: string;
    improvements: string[];
  };
  seoAnalysis: {
    score: number;
    keywords: string[];
    opportunities: string[];
  };
  aiOpportunities: string[];
  growthSuggestions: string[];
  technicalSuggestions: string[];
  personalizedOutreach: string;
}

export interface Report {
  id: string;
  leadId: string;
  lead: Lead;
  companyResearch: CompanyResearch;
  businessAudit: BusinessAudit;
  pdfUrl: string;
  googleDriveFileId: string;
  emailSentAt?: Date;
  createdAt: Date;
}

export interface FormData {
  fullName: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  additionalNotes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WorkflowStatus {
  step: 'validation' | 'research' | 'audit' | 'pdf' | 'email' | 'sheets' | 'drive' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}
