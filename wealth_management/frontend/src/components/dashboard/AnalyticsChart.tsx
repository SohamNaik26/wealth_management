"use client";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function getFontColor() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "#F3F4F6"; // light gray for dark mode
  }
  return "#1F2937"; // dark gray for light mode
}

export const AnalyticsChart: React.FC<{
  data: any;
  searchBar?: React.ReactNode;
}> = ({ data, searchBar }) => {
  const fontColor = getFontColor();
  const pieOptions = {
    plugins: {
      legend: { labels: { color: fontColor } },
      title: {
        display: true,
        text: "Asset Allocation",
        color: fontColor,
        font: { size: 20, weight: "bold" },
      },
    },
  };
  const barOptions = {
    plugins: {
      legend: { labels: { color: fontColor } },
      title: {
        display: true,
        text: "Performance",
        color: fontColor,
        font: { size: 20, weight: "bold" },
      },
    },
    scales: {
      x: { ticks: { color: fontColor } },
      y: { ticks: { color: fontColor } },
    },
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-bold" style={{ color: fontColor }}>
          Portfolio Analytics
        </h2>
        {searchBar && <div className="ml-auto">{searchBar}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Pie data={data.pie} options={pieOptions} />
        </div>
        <div>
          <Bar data={data.bar} options={barOptions} />
        </div>
      </div>
    </div>
  );
};
