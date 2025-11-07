import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import axios from "axios";
import "./AnalyticsPage.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(1); // Default: January
  const [selectedYear, setSelectedYear] = useState(2025); // Default: 2025

  // Hardcoded fallback data
  const fallbackData = {
    pie: {
      missing: [18, 12], // Example: 18 Pending, 12 Solved
      unidentified: [15, 15], // Example: 15 Pending, 15 Solved
    },
    line: {
      dates: ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04", "2025-01-05"],
      missing: [2, 5, 0, 3, 1],
      unidentified: [1, 4, 0, 2, 3],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading spinner
        const response = await axios.get("http://localhost:8000/api/analytics/", {
          params: { year: selectedYear, month: selectedMonth },
        });
        setData(response.data); // Store fetched data
      } catch (error) {
        console.error("Error fetching data, using fallback:", error);
        setData(fallbackData); // Use fallback data on error
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  if (loading) {
    return <div className="analytics-page"><h2>Loading...</h2></div>;
  }

  if (!data) {
    return <div className="analytics-page"><h2>No data available. Please try again later.</h2></div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom sizing
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12, // Legend font size
          },
        },
      },
    },
    layout: {
      padding: 10, // Padding around the chart
    },
  };

  const pieDataMissing = {
    labels: ["Pending", "Solved"],
    datasets: [
      {
        data: data.pie.missing,
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const pieDataUnidentified = {
    labels: ["Pending", "Solved"],
    datasets: [
      {
        data: data.pie.unidentified,
        backgroundColor: ["#FF9F40", "#4BC0C0"],
      },
    ],
  };

  const lineDataMissing = {
    labels: data.line.dates,
    datasets: [
      {
        label: "Missing Persons Cases",
        data: data.line.missing,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255,99,132,0.2)",
      },
    ],
  };

  const lineDataUnidentified = {
    labels: data.line.dates,
    datasets: [
      {
        label: "Unidentified Persons Cases",
        data: data.line.unidentified,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.2)",
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>Police Analytics Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <label htmlFor="month">Select Month: </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>

        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>

      {/* Pie Charts */}
      <div className="pie-charts-container">
        <div className="pie-chart">
          <h3>Missing Persons</h3>
          <Pie data={pieDataMissing} options={options} />
        </div>
        <div className="pie-chart">
          <h3>Unidentified Persons</h3>
          <Pie data={pieDataUnidentified} options={options} />
        </div>
      </div>

      {/* Line Graphs */}
      <div className="line-chart">
        <h3>Cases Reported Per Day (Missing Persons)</h3>
        <Line data={lineDataMissing} options={options} />
      </div>
      <div className="line-chart">
        <h3>Cases Reported Per Day (Unidentified Persons)</h3>
        <Line data={lineDataUnidentified} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
