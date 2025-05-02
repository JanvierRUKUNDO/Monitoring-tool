import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, ApplicationStatus } from "@/types";
import { Chart } from "@/components/ui/chart";

interface StatusOverviewProps {
  applicationsByStatus: Record<ApplicationStatus, Application[]>;
}

export default function StatusOverview({ applicationsByStatus }: StatusOverviewProps) {
  // Prepare data for chart
  const labels = Object.keys(applicationsByStatus).filter(status => applicationsByStatus[status as ApplicationStatus].length > 0); // Filter out statuses with 0 applications
  const data = labels.map(status => applicationsByStatus[status as ApplicationStatus].length);
  
  // Colors for different statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Licensed":
      case "Registered":
      case "Active":
        return "rgba(34, 197, 94, 0.7)"; // green
      case "Not Approved":
      case "Expired":
      case "Withdraw":
      case "Closed":
      case "Inactive":
        return "rgba(239, 68, 68, 0.7)"; // red
      case "On hold":
      case "Waiting Inspection":
      case "Waiting query response":
      case "Waiting CAPA before ILTC":
        return "rgba(234, 179, 8, 0.7)"; // yellow
      default:
        return "rgba(59, 130, 246, 0.7)"; // blue
    }
  };

  const backgroundColors = labels.map(status => getStatusColor(status));

  // Ensure the data structure matches the ChartData interface in chart.tsx
  const chartData = {
    labels,
    datasets: [
      {
        label: "Applications",
        data,
        backgroundColor: backgroundColors,
        // Optionally add borderColor and borderWidth if needed by your chart styling
        // borderColor: backgroundColors.map(color => color.replace("0.7", "1")),
        // borderWidth: 1,
      },
    ],
  };

  // Recharts options are passed directly to the BarChart component inside Chart.tsx
  // We can simplify options here or pass specific Recharts props via the options prop if needed.
  const chartOptions = {
    // Example: Customize tooltip or legend if needed beyond the defaults in Chart.tsx
    // plugins: {
    //   legend: {
    //     display: true, // Example: Force display legend
    //   },
    // },
    // Example: Add margin to the chart
    margin: { top: 5, right: 20, left: 10, bottom: 5 },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full"> {/* Ensure container has dimensions */}
          {labels.length > 0 ? (
            <Chart
              type="bar"
              data={chartData} // Pass the correctly structured data
              options={chartOptions} // Pass recharts options
            />
          ) : (
            <p className="text-center text-gray-500">No application data to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
