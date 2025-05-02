
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Application } from "@/types";
import { Badge } from "@/components/ui/badge";

interface RecentApplicationsProps {
  applications: Application[];
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
  // Sort applications by updatedAt date (most recent first)
  const sortedApplications = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5); // Get only the 5 most recent

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.applicationStatus.trackingNumber}</TableCell>
                <TableCell>{application.applicationStatus.applicantName}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(application.applicationStatus.applicationStatus)}>
                    {application.applicationStatus.applicationStatus}
                  </Badge>
                </TableCell>
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
      </CardContent>
    </Card>
  );
}
