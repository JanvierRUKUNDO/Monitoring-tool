
import { Application, ApplicationStatus } from "@/types";

// Generate a random date within the last year
const getRandomDate = () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTime).toISOString().split("T")[0];
};

// Generate a random tracking number
const getRandomTrackingNumber = () => {
  return `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Sample application statuses
const applicationStatuses: ApplicationStatus[] = [
  "Under Assessment",
  "Waiting Inspection",
  "Waiting query response",
  "On inspection list",
  "Inspected - ready for ILTC",
  "Waiting CAPA before ILTC",
  "Not inspected - waiting inspection",
  "Approved",
  "Not Approved",
  "Under feedback submission",
  "Under license submission",
  "Licensed",
  "Registered",
  "Active",
  "Inactive",
  "On hold",
  "Closed",
  "Withdraw",
  "Expired"
];

// Generate mock applications
export const generateMockApplications = (count: number): Application[] => {
  const applications: Application[] = [];

  for (let i = 0; i < count; i++) {
    const firstApplicationDate = getRandomDate();
    const currentApplicationDate = getRandomDate();
    const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
    
    applications.push({
      id: `APP-${i + 1}`,
      createdAt: firstApplicationDate,
      updatedAt: currentApplicationDate,
      createdBy: "admin",
      updatedBy: "admin",
      applicationStatus: {
        trackingNumber: getRandomTrackingNumber(),
        applicantName: `Applicant ${i + 1}`,
        firstApplicationDate,
        currentApplicationDate,
        requestType: "New application",
        assessor: "Christian",
        applicationStatus: status,
        generalStatus: "New",
        specialNote: i % 3 === 0 ? "Special attention required" : undefined,
      },
      applicationDetails: {
        premiseCategory: "Food Manufacture",
        productCategory: "Cereal products",
        productType: "Maize flour",
        gmpCertification: "Yes",
        numberOfRegisteredProducts: Math.floor(Math.random() * 10) + 1,
        brandName: `Brand ${i + 1}`,
        listOfRegisteredProducts: `Product ${i + 1}, Product ${i + 2}`,
        tinNumber: `TIN${100000 + i}`,
        officialTelephone: `+25078${1000000 + i}`,
        officialEmail: `company${i}@example.com`,
        country: "Rwanda",
        province: "Kigali",
        district: "Gasabo",
        sector: "Kimironko",
        cell: "Kibagabaga",
        villageStreetNumber: `Street ${i + 1}`,
        managingDirectorName: `Director ${i + 1}`,
        contactPerson: `Contact ${i + 1}`,
        responsibleTechnicianName: `Technician ${i + 1}`,
        responsibleTechnicianQualification: "Food Science Degree",
        responsibleTechnicianTelephone: `+25079${1000000 + i}`,
        premiseStatus: "Active",
        assessmentDecision: "Ready for Inspections",
      }
    });
  }

  return applications;
};

// Mock data for the dashboard
export const mockApplications = generateMockApplications(50);

// Group applications by status
export const getApplicationsByStatus = () => {
  const grouped: Record<ApplicationStatus, Application[]> = {} as Record<ApplicationStatus, Application[]>;
  
  applicationStatuses.forEach(status => {
    grouped[status] = mockApplications.filter(app => app.applicationStatus.applicationStatus === status);
  });
  
  return grouped;
};
