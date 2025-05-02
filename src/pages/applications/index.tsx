
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { Application, ApplicationStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ApplicationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { applications, isLoading: appsLoading } = useApplications();
  const router = useRouter();
  const { status } = router.query;
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "admin" && user.role !== "staff") {
      router.push("/");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!appsLoading && applications.length > 0) {
      if (status && typeof status === "string") {
        // Filter applications by the status from query parameter
        const filtered = applications.filter(
          app => app.applicationStatus.applicationStatus === status
        );
        setFilteredApplications(filtered);
      } else {
        // If no status filter, show all applications
        setFilteredApplications(applications);
      }
    }
  }, [status, applications, appsLoading]);

  if (authLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return null;
  }

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Licensed":
      case "Registered":
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Not Approved":
      case "Expired":
      case "Withdraw":
      case "Closed":
      case "Inactive":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "On hold":
      case "Waiting Inspection":
      case "Waiting query response":
      case "Waiting CAPA before ILTC":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  return (
    <>
      <Head>
        <title>
          {status ? `${status} Applications` : "All Applications"} | Application Monitoring System
        </title>
      </Head>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {status ? `${status} Applications` : "All Applications"}
          </h1>
          <p className="text-gray-500">
            {status 
              ? `Viewing applications with status: ${status}`
              : "Viewing all applications in the system"
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredApplications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Assessor</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.applicationStatus.trackingNumber}</TableCell>
                      <TableCell>{application.applicationStatus.applicantName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(application.applicationStatus.applicationStatus)}>
                          {application.applicationStatus.applicationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.applicationStatus.requestType}</TableCell>
                      <TableCell>{application.applicationStatus.assessor}</TableCell>
                      <TableCell>{new Date(application.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={`/applications/${application.id}`} className="text-blue-600 hover:underline">
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found with the specified status.</p>
                <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                  Return to Dashboard
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
