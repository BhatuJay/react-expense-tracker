import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./PieChart.css";

export default function PieChart({ handlePieChartClose }) {
  const [data, setData] = useState([["Category", "Amount"]]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("https://686faa6c91e85fac42a203ee.mockapi.io/expense");
        const expenses = res.data;

        const categoryTotals = {};
        expenses.forEach(({ category, amount }) => {
          if (!category) return;
          const amt = Number(amount);
          if (!isNaN(amt)) {
            categoryTotals[category] = (categoryTotals[category] || 0) + amt;
          }
        });

        const chartData = [["Category", "Amount"]];
        for (const [category, total] of Object.entries(categoryTotals)) {
          chartData.push([category, total]);
        }

        setData(chartData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const options = {
    // 📌 GENERAL
    title: "Expenses by Category",
    titleTextStyle: {
      color: "#2c3e50",
      fontName: "Arial",
      fontSize: 18,
      bold: true,
      italic: false,
    },

    // 🎯 PIE APPEARANCE
    pieHole: 0.4,
    is3D: false,

    // 🧩 SLICE CONFIG
    slices: {
      0: { color: "#4e79a7", offset: 0.05 },
      1: { color: "#f28e2b" },
      2: { color: "#e15759", offset: 0.1 },
    },

    // 🎨 COLORS
    colors: [
      "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
      "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab",
    ],

    // 📝 SLICE TEXT
    pieSliceText: "percentage",
    pieSliceTextStyle: {
      color: "#fff",
      fontSize: 14,
    },

    // 🎛️ TOOLTIP
    tooltip: {
      trigger: "focus",
      text: "both",
      isHtml: false,
      textStyle: {
        color: "#444",
        fontSize: 12,
      },
      showColorCode: true,
    },

    // 📊 LEGEND
    legend: {
      position: "right",
      alignment: "center",
      textStyle: {
        color: "#555",
        fontSize: 14,
      },
    },

    // 📐 CHART AREA
    chartArea: {
      left: "10%",
      top: "10%",
      width: "80%",
      height: "75%",
      backgroundColor: {
        fill: "transparent",
        stroke: "#ccc",
        strokeWidth: 0,
      },
    },

    // ⚡ ANIMATION
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },

    // 🅰️ FONTS
    fontName: "Roboto",
    fontSize: 14,

    // 🧾 BACKGROUND
    backgroundColor: {
      fill: "transparent",
    },

    // ✅ INTERACTIVITY
    enableInteractivity: true,

    // 🎯 SLICE BORDER
    pieSliceBorderColor: "#fff",

    // 🔘 DIRECTION
    pieStartAngle: 0,

    // 📏 FORCE IFRAME (rare)
    forceIFrame: false,
  };

  return (
    <div className="add-expense-modalOverlay">
      <div className="add-expense-modal">
        <h1>Pie Chart</h1>
        <div style={{ maxWidth: 700, margin: "20px auto" }}>
          {loading ? (
            <p className="pie-chart-loading">Loading chart...</p>
          ) : data.length === 1 ? (
            <p className="pie-chart-empty">No expense data available.</p>
          ) : (
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width="100%"
              height="400px"
            />
          )}
        </div>
        <div className="add-expense-btn-grp">
          <button type="button" className="btn-red" onClick={handlePieChartClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}