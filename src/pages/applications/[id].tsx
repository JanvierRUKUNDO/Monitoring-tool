import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { Application, ApplicationStatus, RequestType, Assessor, GeneralStatus, ApplicationStatusData, ApplicationDetailsData, ConceptNoteData, InspectionFindingsData, ILTCResolutionData, SubmissionProcessData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ApplicationDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { getApplication, updateApplication, isLoading: appsLoading } = useApplications();
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState<Application | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editedApplication, setEditedApplication] = useState<Partial<Application>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (id && typeof id === "string" && !appsLoading) {
      const app = getApplication(id);
      setApplication(app);
      if (app) {
        setEditedApplication(app);
      }
    }
  }, [id, getApplication, appsLoading]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (application) {
      setEditedApplication(application);
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (id && typeof id === "string" && editedApplication) {
      updateApplication(id, editedApplication);
      setIsEditing(false);
      // Refresh the application data
      const updatedApp = getApplication(id);
      setApplication(updatedApp);
    }
  };

  const handleChange = (section: keyof Omit<Application, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">, field: string, value: any) => {
    setEditedApplication(prev => {
      // Ensure prev is not null/undefined before proceeding
      if (!prev) return {}; 

      // Get the current data for the section, defaulting to an empty object if it doesn't exist
      const currentSectionData = prev[section] || {};

      // Create the updated section data by merging the current data with the new field value
      const updatedSectionData = {
        ...currentSectionData,
        [field]: value
      };

      // Return the updated state, merging the previous state with the updated section
      // Use type assertion to satisfy TypeScript, ensuring the structure aligns with Partial<Application>
      return {
        ...prev,
        [section]: updatedSectionData
      } as Partial<Application>; 
    });
  };

  if (authLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-500">Application not found</p>
        <Link href="/applications" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Licensed":
      case "Registered":
      case "Active":
        return "bg-green-100 text-green-800";
      case "Not Approved":
      case "Expired":
      case "Withdraw":
      case "Closed":
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "On hold":
      case "Waiting Inspection":
      case "Waiting query response":
      case "Waiting CAPA before ILTC":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // All possible status options
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

  return (
    <>
      <Head>
        <title>Application Details | Application Monitoring System</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Application Details</h1>
            <p className="text-gray-500">
              Viewing details for application {application.applicationStatus.trackingNumber}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (user.role === "admin" || user.role === "staff") && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Application
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="default" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
            <Link href="/applications">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Application Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isEditing ? (
                // Editing mode
                <>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={editedApplication.applicationStatus?.applicationStatus || application.applicationStatus.applicationStatus}
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
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input 
                      id="trackingNumber" 
                      value={editedApplication.applicationStatus?.trackingNumber || application.applicationStatus.trackingNumber}
                      onChange={(e) => handleChange("applicationStatus", "trackingNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input 
                      id="registrationNumber" 
                      value={editedApplication.applicationStatus?.registrationNumber || application.applicationStatus.registrationNumber || ""}
                      onChange={(e) => handleChange("applicationStatus", "registrationNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantName">Applicant Name</Label>
                    <Input 
                      id="applicantName" 
                      value={editedApplication.applicationStatus?.applicantName || application.applicationStatus.applicantName}
                      onChange={(e) => handleChange("applicationStatus", "applicantName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstApplicationDate">First Application Date</Label>
                    <Input 
                      id="firstApplicationDate" 
                      type="date"
                      value={editedApplication.applicationStatus?.firstApplicationDate || application.applicationStatus.firstApplicationDate}
                      onChange={(e) => handleChange("applicationStatus", "firstApplicationDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentApplicationDate">Current Application Date</Label>
                    <Input 
                      id="currentApplicationDate" 
                      type="date"
                      value={editedApplication.applicationStatus?.currentApplicationDate || application.applicationStatus.currentApplicationDate}
                      onChange={(e) => handleChange("applicationStatus", "currentApplicationDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select 
                      value={editedApplication.applicationStatus?.requestType || application.applicationStatus.requestType}
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
                      value={editedApplication.applicationStatus?.assessor || application.applicationStatus.assessor}
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
                    <Label htmlFor="generalStatus">General Status</Label>
                    <Select 
                      value={editedApplication.applicationStatus?.generalStatus || application.applicationStatus.generalStatus}
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
                    <Label htmlFor="specialNote">Special Note</Label>
                    <Textarea 
                      id="specialNote" 
                      value={editedApplication.applicationStatus?.specialNote || application.applicationStatus.specialNote || ""}
                      onChange={(e) => handleChange("applicationStatus", "specialNote", e.target.value)}
                    />
                  </div>
                </>
              ) : (
                // View mode
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge className={getStatusBadgeColor(application.applicationStatus.applicationStatus)}>
                      {application.applicationStatus.applicationStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                    <p>{application.applicationStatus.trackingNumber}</p>
                  </div>
                  {application.applicationStatus.registrationNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration Number</p>
                      <p>{application.applicationStatus.registrationNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Applicant Name</p>
                    <p>{application.applicationStatus.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Application Date</p>
                    <p>{application.applicationStatus.firstApplicationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Application Date</p>
                    <p>{application.applicationStatus.currentApplicationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Type</p>
                    <p>{application.applicationStatus.requestType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assessor</p>
                    <p>{application.applicationStatus.assessor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">General Status</p>
                    <p>{application.applicationStatus.generalStatus}</p>
                  </div>
                  {application.applicationStatus.specialNote && (
                    <div className="col-span-full">
                      <p className="text-sm font-medium text-gray-500">Special Note</p>
                      <p>{application.applicationStatus.specialNote}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Premise Category</p>
                <p>{application.applicationDetails.premiseCategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Product Category</p>
                <p>{application.applicationDetails.productCategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Product Type</p>
                <p>{application.applicationDetails.productType}</p>
              </div>
              {application.applicationDetails.otherProductSpecify && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Other Product Specify</p>
                  <p>{application.applicationDetails.otherProductSpecify}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">GMP Certification</p>
                <p>{application.applicationDetails.gmpCertification}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Number of Registered Products</p>
                <p>{application.applicationDetails.numberOfRegisteredProducts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Brand Name</p>
                <p>{application.applicationDetails.brandName}</p>
              </div>
              <div className="col-span-full">
                <p className="text-sm font-medium text-gray-500">List of Registered Products</p>
                <p>{application.applicationDetails.listOfRegisteredProducts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">TIN Number</p>
                <p>{application.applicationDetails.tinNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Official Telephone</p>
                <p>{application.applicationDetails.officialTelephone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Official Email</p>
                <p>{application.applicationDetails.officialEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Country</p>
                <p>{application.applicationDetails.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Province</p>
                <p>{application.applicationDetails.province}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">District</p>
                <p>{application.applicationDetails.district}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sector</p>
                <p>{application.applicationDetails.sector}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cell</p>
                <p>{application.applicationDetails.cell}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Village/Street Number</p>
                <p>{application.applicationDetails.villageStreetNumber}</p>
              </div>
              {application.applicationDetails.gpsCoordinates && (
                <div>
                  <p className="text-sm font-medium text-gray-500">GPS Coordinates</p>
                  <p>{application.applicationDetails.gpsCoordinates}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Managing Director Name</p>
                <p>{application.applicationDetails.managingDirectorName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Person</p>
                <p>{application.applicationDetails.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Responsible Technician Name</p>
                <p>{application.applicationDetails.responsibleTechnicianName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Responsible Technician Qualification</p>
                <p>{application.applicationDetails.responsibleTechnicianQualification}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Responsible Technician Telephone</p>
                <p>{application.applicationDetails.responsibleTechnicianTelephone}</p>
              </div>
              {application.applicationDetails.assessmentComment && (
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-500">Assessment Comment</p>
                  <p>{application.applicationDetails.assessmentComment}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Premise Status</p>
                <p>{application.applicationDetails.premiseStatus}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assessment Decision</p>
                <p>{application.applicationDetails.assessmentDecision}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concept Note Section (if available) */}
        {application.conceptNote && (
          <Card>
            <CardHeader>
              <CardTitle>Concept Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Concept Note</p>
                  <p>{application.conceptNote.conceptNoteDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Concept Note Initiator</p>
                  <p>{application.conceptNote.conceptNoteInitiator}</p>
                </div>
                {application.conceptNote.conceptNoteComment && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Concept Note Comment</p>
                    <p>{application.conceptNote.conceptNoteComment}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inspection Findings Section (if available) */}
        {application.inspectionFindings && (
          <Card>
            <CardHeader>
              <CardTitle>Inspection Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of First Inspection</p>
                  <p>{application.inspectionFindings.firstInspectionDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Leading Inspector</p>
                  <p>{application.inspectionFindings.leadingInspector}</p>
                </div>
                {application.inspectionFindings.otherInspector && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Other Inspector</p>
                    <p>{application.inspectionFindings.otherInspector}</p>
                  </div>
                )}
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-500">Key Findings</p>
                  <p>{application.inspectionFindings.keyFindings}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Inspection Decision</p>
                  <p>{application.inspectionFindings.inspectionDecision}</p>
                </div>
                
                {/* Second Inspection (if applicable) */}
                {application.inspectionFindings.secondInspectionDate && (
                  <>
                    <div className="col-span-full mt-4">
                      <h3 className="font-medium">Second Inspection</h3>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Second Inspection</p>
                      <p>{application.inspectionFindings.secondInspectionDate}</p>
                    </div>
                    {application.inspectionFindings.secondLeadingInspector && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Leading Inspector</p>
                        <p>{application.inspectionFindings.secondLeadingInspector}</p>
                      </div>
                    )}
                    {application.inspectionFindings.secondOtherInspector && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Other Inspector</p>
                        <p>{application.inspectionFindings.secondOtherInspector}</p>
                      </div>
                    )}
                    {application.inspectionFindings.secondKeyFindings && (
                      <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-500">Key Findings</p>
                        <p>{application.inspectionFindings.secondKeyFindings}</p>
                      </div>
                    )}
                    {application.inspectionFindings.secondInspectionDecision && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Inspection Decision</p>
                        <p>{application.inspectionFindings.secondInspectionDecision}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ILTC Resolution Section (if available) */}
        {application.iltcResolution && (
          <Card>
            <CardHeader>
              <CardTitle>ILTC Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of ILTC</p>
                  <p>{application.iltcResolution.iltcDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Minute Taker</p>
                  <p>{application.iltcResolution.minuteTaker}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Chair of ILTC</p>
                  <p>{application.iltcResolution.chairOfILTC}</p>
                </div>
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-500">Discussion Note</p>
                  <p>{application.iltcResolution.discussionNote}</p>
                </div>
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-500">Observation</p>
                  <p>{application.iltcResolution.observation}</p>
                </div>
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-500">Resolution/Recommendation</p>
                  <p>{application.iltcResolution.resolutionRecommendation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Responsible Person</p>
                  <p>{application.iltcResolution.responsiblePerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Timeline</p>
                  <p>{application.iltcResolution.timeline}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ILTC Status</p>
                  <p>{application.iltcResolution.iltcStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Process Section (if available) */}
        {application.submissionProcess && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Submission Status</p>
                  <p>{application.submissionProcess.submissionStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Responsible Staff</p>
                  <p>{application.submissionProcess.responsibleStaff}</p>
                </div>
                
                {application.submissionProcess.submissionDateToAnalyst && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to Analyst</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToAnalyst}</p>
                    {application.submissionProcess.submissionNoteToAnalyst && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToAnalyst}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToDM && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to DM</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToDM}</p>
                    {application.submissionProcess.submissionNoteToDM && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToDM}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToHoD && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to HoD</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToHoD}</p>
                    {application.submissionProcess.submissionNoteToHoD && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToHoD}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToLegalDesk && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to Legal Desk</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToLegalDesk}</p>
                    {application.submissionProcess.submissionNoteToLegalDesk && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToLegalDesk}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToDDGDG && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to DDG/DG</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToDDGDG}</p>
                    {application.submissionProcess.submissionNoteToDDGDG && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToDDGDG}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToCentralSecretariat && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to Central Secretariat</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToCentralSecretariat}</p>
                    {application.submissionProcess.submissionNoteToCentralSecretariat && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToCentralSecretariat}</p>
                    )}
                  </div>
                )}
                
                {application.submissionProcess.submissionDateToClient && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Submission to Client</p>
                    <p className="font-medium">{application.submissionProcess.submissionDateToClient}</p>
                    {application.submissionProcess.submissionNoteToClient && (
                      <p className="text-sm mt-1">{application.submissionProcess.submissionNoteToClient}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
