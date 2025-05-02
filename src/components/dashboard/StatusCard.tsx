
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, ApplicationStatus } from "@/types";

interface StatusCardProps {
  status: ApplicationStatus;
  applications: Application[];
}

export default function StatusCard({ status, applications }: StatusCardProps) {
  const count = applications.length;
  
  // Determine card color based on status
  const getCardColor = () => {
    switch (status) {
      case "Approved":
      case "Licensed":
      case "Registered":
      case "Active":
        return "border-green-500 bg-green-50";
      case "Not Approved":
      case "Expired":
      case "Withdraw":
      case "Closed":
      case "Inactive":
        return "border-red-500 bg-red-50";
      case "On hold":
      case "Waiting Inspection":
      case "Waiting query response":
      case "Waiting CAPA before ILTC":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  return (
    <Card className={`${getCardColor()} border-l-4 hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{status}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={`/applications?status=${encodeURIComponent(status)}`} className="text-xs text-blue-600 hover:underline">
          View applications
        </Link>
      </CardFooter>
    </Card>
  );
}
