"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Define a more specific interface for the chart data structure
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

// Define the Chart component props interface
interface ChartProps {
  type: "bar"; // Extend this for other chart types if necessary
  data: ChartData; // Use the specific ChartData interface
  options?: any; // You might want a more specific type based on recharts options
}

// Simple wrapper for now, focusing on BarChart
export const Chart: React.FC<ChartProps> = ({ type, data, options }) => {
  if (type === "bar" && data && data.datasets.length > 0) {
    // Map the input data structure to the structure expected by Recharts BarChart
    const chartData = data.labels.map((label: string, index: number) => ({
      name: label,
      value: data.datasets[0].data[index], // Assuming the first dataset holds the primary values
      fill: data.datasets[0].backgroundColor[index], // Use background color for fill
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} {...options}> {/* Pass options to BarChart */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [`${props.payload.name}: ${value} applications`, null]}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} // Add a subtle cursor fill
          />
          {/* Conditionally render Legend based on options */}
          {options?.plugins?.legend?.display !== false && <Legend />} 
          <Bar dataKey="value" /> {/* Ensure fill is applied per bar via chartData */}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Add support for other chart types here if needed
  return <div>Unsupported chart type or missing/invalid data</div>;
};

// You might want to export specific chart components directly if preferred
// export { BarChart, LineChart, PieChart } from "recharts";
