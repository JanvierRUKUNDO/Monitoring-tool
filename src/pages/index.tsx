import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";
import StatusCard from "@/components/dashboard/StatusCard";
import RecentApplications from "@/components/dashboard/RecentApplications";
import StatusOverview from "@/components/dashboard/StatusOverview";
import { ApplicationStatus } from "@/types";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { applications, applicationsByStatus, isLoading: appsLoading } = useApplications();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

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

  // Get all status types
  const statusTypes: ApplicationStatus[] = [
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

  return (
    <>
      <Head>
        <title>Dashboard | Application Monitoring System</title>
      </Head>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Overview of all application statuses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statusTypes.map((status) => (
            <StatusCard 
              key={status} 
              status={status} 
              applications={applicationsByStatus[status] || []} 
            />
          ))}
        </div>

        <div className="mt-8">
          <StatusOverview applicationsByStatus={applicationsByStatus} />
        </div>

        <div className="mt-8">
          <RecentApplications applications={applications} />
        </div>
      </div>
    </>
  );
}
