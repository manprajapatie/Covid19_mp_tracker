// LineGraph.jsx
import React, { useState, useEffect } from "react";
import "chartjs-adapter-date-fns"; // adapter for chart.js time scale (recommended)
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { radius: 0 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (context) {
          // robust: prefer parsed, fallback to raw
          const value =
            context.parsed?.y ?? context.raw?.y ?? (context.raw ?? context.parsed);
          return numeral(value).format("+0,0");
        },
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        // tooltipFormat uses date-fns tokens when using chartjs-adapter-date-fns
        tooltipFormat: "PP",
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        callback: function (value) {
          return numeral(value).format("0a");
        },
      },
    },
  },
};

function parseApiDate(str) {
  // API date format is like "1/22/20" (M/D/YY) — make a safe Date object
  const parts = String(str).split("/");
  if (parts.length !== 3) return new Date(str); // fallback
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const yy = parseInt(parts[2], 10);
  const year = 2000 + yy; // '20' -> 2020
  return new Date(year, month - 1, day);
}

function buildChartData(rawData, casesType = "cases") {
  if (!rawData || !rawData.cases) return [];
  // get dates, parse & sort them to be safe
  const dates = Object.keys(rawData.cases || {}).sort((a, b) => {
    return parseApiDate(a) - parseApiDate(b);
  });

  const chartData = [];
  let last = null;
  for (const dateKey of dates) {
    const currentValue = rawData[casesType][dateKey];
    if (last !== null && typeof currentValue === "number") {
      chartData.push({
        x: parseApiDate(dateKey),
        y: currentValue - last,
      });
    }
    last = currentValue;
  }
  return chartData;
}

export default function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
        );
        if (!res.ok) throw new Error("Network response not ok: " + res.status);
        const json = await res.json();
        const chartData = buildChartData(json, casesType);
        if (mounted) {
          console.log("Chart sample:", chartData.slice(0, 5));
          setData(chartData);
        }
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [casesType]);

  return (
    <div >
      {data && data.length > 0 ? (
        <Line
          data={{
            datasets: [
              {
                label: casesType,
                data: data, // array of {x: Date, y: number}
                borderColor: "#CC1034",
                backgroundColor: "rgba(204, 16, 52, 0.25)",
                tension: 0.2,
                pointRadius: 0,
              },
            ],
          }}
          options={options}
        />
      ) : (
        <div style={{ padding: 20 }}>Loading chart...</div>
      )}
    </div>
  );
}
