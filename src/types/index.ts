
export type UserRole = "admin" | "staff" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ApplicationStatus = 
  | "Under Assessment"
  | "Waiting Inspection"
  | "Waiting query response"
  | "On inspection list"
  | "Inspected - ready for ILTC"
  | "Waiting CAPA before ILTC"
  | "Not inspected - waiting inspection"
  | "Approved"
  | "Not Approved"
  | "Under feedback submission"
  | "Under license submission"
  | "Licensed"
  | "Registered"
  | "Active"
  | "Inactive"
  | "On hold"
  | "Closed"
  | "Withdraw"
  | "Expired";

export type GeneralStatus = "New" | "Registered" | "On hold";

export type RequestType = 
  | "New application"
  | "License renewal"
  | "Variation"
  | "Disposal of unfit prods";

export type Assessor = 
  | "Christian"
  | "Aristide"
  | "Oliva"
  | "Alice"
  | "Angelah"
  | "Claudine"
  | "Mugeni"
  | "Janvier"
  | "Justin"
  | "Desire";

export type PremiseCategory = 
  | "Food Manufacture"
  | "Food Wholesale"
  | "Food Supplement Shop"
  | "Food Retailer"
  | "Restaurant";

export type ProductCategory = 
  | "Cereal products"
  | "Alcoholic beverages"
  | "Non alcoholic beverages"
  | "Food supplements"
  | "Infant formulae"
  | "Condiments"
  | "Miscellenous";

export type ProductType = 
  | "Maize flour"
  | "Wheat Flour"
  | "Rice"
  | "Beer"
  | "Plant based alcoholic drink"
  | "Liquor"
  | "Drinking water"
  | "Juice"
  | "Biscuits"
  | "Food supplements"
  | "Infant formula"
  | "Chili sauce"
  | "Other";

export type GMPCertification = "Yes" | "No" | "Under Process";

export type PremiseStatus = "Active" | "Inactive";

export type AssessmentDecision = "Ready for Inspections" | "Waiting query response";

export type InspectionDecision = 
  | "Inspected-Ready for ILTC"
  | "Waiting CAPA before ILTC"
  | "Not inspected"
  | "Cancelled";

export type SubmissionStatus = 
  | "Under Feedback submission"
  | "Under License submission";

export interface ApplicationStatusData {
  registrationNumber?: string;
  trackingNumber: string;
  applicantName: string;
  firstApplicationDate: string;
  currentApplicationDate: string;
  requestType: RequestType;
  assessor: Assessor;
  applicationStatus: ApplicationStatus;
  generalStatus: GeneralStatus;
  specialNote?: string;
}

export interface ApplicationDetailsData {
  premiseCategory: PremiseCategory;
  productCategory: ProductCategory;
  productType: ProductType;
  otherProductSpecify?: string;
  gmpCertification: GMPCertification;
  numberOfRegisteredProducts: number;
  brandName: string;
  listOfRegisteredProducts: string;
  tinNumber: string;
  officialTelephone: string;
  officialEmail: string;
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  villageStreetNumber: string;
  gpsCoordinates?: string;
  managingDirectorName: string;
  contactPerson: string;
  responsibleTechnicianName: string;
  responsibleTechnicianQualification: string;
  responsibleTechnicianTelephone: string;
  assessedDocuments?: File[];
  assessmentComment?: string;
  premiseStatus: PremiseStatus;
  assessmentDecision: AssessmentDecision;
}

export interface ConceptNoteData {
  conceptNoteDate: string;
  conceptNoteInitiator: string;
  conceptNotePlanNumber?: File;
  conceptNoteComment?: string;
}

export interface InspectionFindingsData {
  firstInspectionDate: string;
  leadingInspector: Assessor;
  otherInspector?: string;
  keyFindings: string;
  inspectionReport?: File;
  inspectionDecision: InspectionDecision;
  secondInspectionDate?: string;
  secondLeadingInspector?: Assessor;
  secondOtherInspector?: string;
  secondKeyFindings?: string;
  secondInspectionReport?: File;
  secondInspectionDecision?: InspectionDecision;
}

export interface ILTCResolutionData {
  iltcDate: string;
  minuteTaker: string;
  chairOfILTC: string;
  discussionNote: string;
  observation: string;
  resolutionRecommendation: string;
  responsiblePerson: string;
  timeline: string;
  iltcReport?: File;
  iltcStatus: string;
}

export interface SubmissionProcessData {
  submissionStatus: SubmissionStatus;
  submittedDocument?: File;
  responsibleStaff: Assessor;
  submissionDateToAnalyst?: string;
  submissionNoteToAnalyst?: string;
  submissionDateToDM?: string;
  submissionNoteToDM?: string;
  submissionDateToHoD?: string;
  submissionNoteToHoD?: string;
  submissionDateToLegalDesk?: string;
  submissionNoteToLegalDesk?: string;
  submissionDateToDDGDG?: string;
  submissionNoteToDDGDG?: string;
  submissionDateToCentralSecretariat?: string;
  submissionNoteToCentralSecretariat?: string;
  submissionDateToClient?: string;
  submissionNoteToClient?: string;
}

export interface Application {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  applicationStatus: ApplicationStatusData;
  applicationDetails: ApplicationDetailsData;
  conceptNote?: ConceptNoteData;
  inspectionFindings?: InspectionFindingsData;
  iltcResolution?: ILTCResolutionData;
  submissionProcess?: SubmissionProcessData;
}
