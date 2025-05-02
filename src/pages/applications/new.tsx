import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ApplicationStatus, 
  RequestType, 
  Assessor, 
  GeneralStatus, 
  PremiseCategory,
  ProductCategory,
  ProductType,
  GMPCertification,
  PremiseStatus,
  AssessmentDecision
} from "@/types";

export default function NewApplicationPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addApplication } = useApplications();
  const router = useRouter();
  
  // State for application form
  const [formData, setFormData] = useState({
    applicationStatus: {
      trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      applicantName: "",
      firstApplicationDate: new Date().toISOString().split("T")[0],
      currentApplicationDate: new Date().toISOString().split("T")[0],
      requestType: "New application" as RequestType,
      assessor: "Christian" as Assessor,
      applicationStatus: "Under Assessment" as ApplicationStatus,
      generalStatus: "New" as GeneralStatus,
      specialNote: ""
    },
    applicationDetails: {
      premiseCategory: "Food Manufacture" as PremiseCategory,
      productCategory: "Cereal products" as ProductCategory,
      productType: "Maize flour" as ProductType,
      otherProductSpecify: "",
      gmpCertification: "Yes" as GMPCertification,
      numberOfRegisteredProducts: 1,
      brandName: "",
      listOfRegisteredProducts: "",
      tinNumber: "",
      officialTelephone: "",
      officialEmail: "",
      country: "Rwanda",
      province: "",
      district: "",
      sector: "",
      cell: "",
      villageStreetNumber: "",
      gpsCoordinates: "",
      managingDirectorName: "",
      contactPerson: "",
      responsibleTechnicianName: "",
      responsibleTechnicianQualification: "",
      responsibleTechnicianTelephone: "",
      premiseStatus: "Active" as PremiseStatus,
      assessmentDecision: "Ready for Inspections" as AssessmentDecision
    }
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const handleChange = (section: "applicationStatus" | "applicationDetails", field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section]), // Correctly spread the specific section
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApplication(formData);
    router.push("/applications");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Status options
  const statusOptions: ApplicationStatus[] = [
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

  // Request type options
  const requestTypeOptions: RequestType[] = [
    "New application",
    "License renewal",
    "Variation",
    "Disposal of unfit prods"
  ];

  // Assessor options
  const assessorOptions: Assessor[] = [
    "Christian",
    "Aristide",
    "Oliva",
    "Alice",
    "Angelah",
    "Claudine",
    "Mugeni",
    "Janvier",
    "Justin",
    "Desire"
  ];

  // General status options
  const generalStatusOptions: GeneralStatus[] = [
    "New",
    "Registered",
    "On hold"
  ];

  // Premise category options
  const premiseCategoryOptions: PremiseCategory[] = [
    "Food Manufacture",
    "Food Wholesale",
    "Food Supplement Shop",
    "Food Retailer",
    "Restaurant"
  ];

  // Product category options
  const productCategoryOptions: ProductCategory[] = [
    "Cereal products",
    "Alcoholic beverages",
    "Non alcoholic beverages",
    "Food supplements",
    "Infant formulae",
    "Condiments",
    "Miscellenous"
  ];

  // Product type options
  const productTypeOptions: ProductType[] = [
    "Maize flour",
    "Wheat Flour",
    "Rice",
    "Beer",
    "Plant based alcoholic drink",
    "Liquor",
    "Drinking water",
    "Juice",
    "Biscuits",
    "Food supplements",
    "Infant formula",
    "Chili sauce",
    "Other"
  ];

  // GMP certification options
  const gmpCertificationOptions: GMPCertification[] = [
    "Yes",
    "No",
    "Under Process"
  ];

  // Premise status options
  const premiseStatusOptions: PremiseStatus[] = [
    "Active",
    "Inactive"
  ];

  // Assessment decision options
  const assessmentDecisionOptions: AssessmentDecision[] = [
    "Ready for Inspections",
    "Waiting query response"
  ];

  return (
    <>
      <Head>
        <title>New Application | Application Monitoring System</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">New Application</h1>
            <p className="text-gray-500">Create a new application in the system</p>
          </div>
          <Link href="/applications">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Application Status Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input 
                    id="trackingNumber" 
                    value={formData.applicationStatus.trackingNumber}
                    onChange={(e) => handleChange("applicationStatus", "trackingNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input 
                    id="applicantName" 
                    value={formData.applicationStatus.applicantName}
                    onChange={(e) => handleChange("applicationStatus", "applicantName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstApplicationDate">First Application Date</Label>
                  <Input 
                    id="firstApplicationDate" 
                    type="date"
                    value={formData.applicationStatus.firstApplicationDate}
                    onChange={(e) => handleChange("applicationStatus", "firstApplicationDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentApplicationDate">Current Application Date</Label>
                  <Input 
                    id="currentApplicationDate" 
                    type="date"
                    value={formData.applicationStatus.currentApplicationDate}
                    onChange={(e) => handleChange("applicationStatus", "currentApplicationDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="requestType">Request Type</Label>
                  <Select 
                    value={formData.applicationStatus.requestType}
                    onValueChange={(value) => handleChange("applicationStatus", "requestType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assessor">Assessor</Label>
                  <Select 
                    value={formData.applicationStatus.assessor}
                    onValueChange={(value) => handleChange("applicationStatus", "assessor", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessor" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessorOptions.map(assessor => (
                        <SelectItem key={assessor} value={assessor}>{assessor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="applicationStatus">Application Status</Label>
                  <Select 
                    value={formData.applicationStatus.applicationStatus}
                    onValueChange={(value) => handleChange("applicationStatus", "applicationStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="generalStatus">General Status</Label>
                  <Select 
                    value={formData.applicationStatus.generalStatus}
                    onValueChange={(value) => handleChange("applicationStatus", "generalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select general status" />
                    </SelectTrigger>
                    <SelectContent>
                      {generalStatusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-full">
                  <Label htmlFor="specialNote">Special Note (Optional)</Label>
                  <Textarea 
                    id="specialNote" 
                    value={formData.applicationStatus.specialNote}
                    onChange={(e) => handleChange("applicationStatus", "specialNote", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="premiseCategory">Premise Category</Label>
                  <Select 
                    value={formData.applicationDetails.premiseCategory}
                    onValueChange={(value) => handleChange("applicationDetails", "premiseCategory", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select premise category" />
                    </SelectTrigger>
                    <SelectContent>
                      {premiseCategoryOptions.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Select 
                    value={formData.applicationDetails.productCategory}
                    onValueChange={(value) => handleChange("applicationDetails", "productCategory", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategoryOptions.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productType">Product Type</Label>
                  <Select 
                    value={formData.applicationDetails.productType}
                    onValueChange={(value) => handleChange("applicationDetails", "productType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.applicationDetails.productType === "Other" && (
                  <div>
                    <Label htmlFor="otherProductSpecify">Other Product Specify</Label>
                    <Input 
                      id="otherProductSpecify" 
                      value={formData.applicationDetails.otherProductSpecify}
                      onChange={(e) => handleChange("applicationDetails", "otherProductSpecify", e.target.value)}
                      required={formData.applicationDetails.productType === "Other"}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="gmpCertification">GMP Certification</Label>
                  <Select 
                    value={formData.applicationDetails.gmpCertification}
                    onValueChange={(value) => handleChange("applicationDetails", "gmpCertification", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select GMP certification" />
                    </SelectTrigger>
                    <SelectContent>
                      {gmpCertificationOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numberOfRegisteredProducts">Number of Registered Products</Label>
                  <Input 
                    id="numberOfRegisteredProducts" 
                    type="number"
                    min="0"
                    value={formData.applicationDetails.numberOfRegisteredProducts.toString()}
                    onChange={(e) => handleChange("applicationDetails", "numberOfRegisteredProducts", parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input 
                    id="brandName" 
                    value={formData.applicationDetails.brandName}
                    onChange={(e) => handleChange("applicationDetails", "brandName", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-full">
                  <Label htmlFor="listOfRegisteredProducts">List of Registered Products</Label>
                  <Textarea 
                    id="listOfRegisteredProducts" 
                    value={formData.applicationDetails.listOfRegisteredProducts}
                    onChange={(e) => handleChange("applicationDetails", "listOfRegisteredProducts", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tinNumber">TIN Number</Label>
                  <Input 
                    id="tinNumber" 
                    value={formData.applicationDetails.tinNumber}
                    onChange={(e) => handleChange("applicationDetails", "tinNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="officialTelephone">Official Telephone</Label>
                  <Input 
                    id="officialTelephone" 
                    value={formData.applicationDetails.officialTelephone}
                    onChange={(e) => handleChange("applicationDetails", "officialTelephone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="officialEmail">Official Email</Label>
                  <Input 
                    id="officialEmail" 
                    type="email"
                    value={formData.applicationDetails.officialEmail}
                    onChange={(e) => handleChange("applicationDetails", "officialEmail", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={formData.applicationDetails.country}
                    onChange={(e) => handleChange("applicationDetails", "country", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input 
                    id="province" 
                    value={formData.applicationDetails.province}
                    onChange={(e) => handleChange("applicationDetails", "province", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input 
                    id="district" 
                    value={formData.applicationDetails.district}
                    onChange={(e) => handleChange("applicationDetails", "district", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Input 
                    id="sector" 
                    value={formData.applicationDetails.sector}
                    onChange={(e) => handleChange("applicationDetails", "sector", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cell">Cell</Label>
                  <Input 
                    id="cell" 
                    value={formData.applicationDetails.cell}
                    onChange={(e) => handleChange("applicationDetails", "cell", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="villageStreetNumber">Village/Street Number</Label>
                  <Input 
                    id="villageStreetNumber" 
                    value={formData.applicationDetails.villageStreetNumber}
                    onChange={(e) => handleChange("applicationDetails", "villageStreetNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gpsCoordinates">GPS Coordinates (Optional)</Label>
                  <Input 
                    id="gpsCoordinates" 
                    value={formData.applicationDetails.gpsCoordinates}
                    onChange={(e) => handleChange("applicationDetails", "gpsCoordinates", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="managingDirectorName">Managing Director Name</Label>
                  <Input 
                    id="managingDirectorName" 
                    value={formData.applicationDetails.managingDirectorName}
                    onChange={(e) => handleChange("applicationDetails", "managingDirectorName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input 
                    id="contactPerson" 
                    value={formData.applicationDetails.contactPerson}
                    onChange={(e) => handleChange("applicationDetails", "contactPerson", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleTechnicianName">Responsible Technician Name</Label>
                  <Input 
                    id="responsibleTechnicianName" 
                    value={formData.applicationDetails.responsibleTechnicianName}
                    onChange={(e) => handleChange("applicationDetails", "responsibleTechnicianName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleTechnicianQualification">Responsible Technician Qualification</Label>
                  <Input 
                    id="responsibleTechnicianQualification" 
                    value={formData.applicationDetails.responsibleTechnicianQualification}
                    onChange={(e) => handleChange("applicationDetails", "responsibleTechnicianQualification", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleTechnicianTelephone">Responsible Technician Telephone</Label>
                  <Input 
                    id="responsibleTechnicianTelephone" 
                    value={formData.applicationDetails.responsibleTechnicianTelephone}
                    onChange={(e) => handleChange("applicationDetails", "responsibleTechnicianTelephone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="premiseStatus">Premise Status</Label>
                  <Select 
                    value={formData.applicationDetails.premiseStatus}
                    onValueChange={(value) => handleChange("applicationDetails", "premiseStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select premise status" />
                    </SelectTrigger>
                    <SelectContent>
                      {premiseStatusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assessmentDecision">Assessment Decision</Label>
                  <Select 
                    value={formData.applicationDetails.assessmentDecision}
                    onValueChange={(value) => handleChange("applicationDetails", "assessmentDecision", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment decision" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentDecisionOptions.map(decision => (
                        <SelectItem key={decision} value={decision}>{decision}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Application
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
