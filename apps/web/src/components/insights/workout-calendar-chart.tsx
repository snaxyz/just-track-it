"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useColorScheme, Box } from "@mui/material";

export function WorkoutCalendarChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { mode } = useColorScheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, mode, {
      renderer: "canvas",
    });

    // Generate dates for the last 3 months
    const today = new Date();
    const data: [string, number][] = [];
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      // Random workout intensity (0 = no workout, 1-3 = workout intensity)
      const value = Math.floor(Math.random() * 4);
      data.push([date.toISOString().split("T")[0], value]);
    }

    const option = {
      backgroundColor: "transparent",
      title: {
        left: "center",
        textStyle: {
          color: mode === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        position: "top",
        formatter: function (p: any) {
          const value = p.data[1];
          return `${p.data[0]}<br/>
                  ${
                    value === 0
                      ? "Rest Day"
                      : value === 1
                        ? "Light Workout"
                        : value === 2
                          ? "Moderate Workout"
                          : "Intense Workout"
                  }`;
        },
      },
      visualMap: {
        min: 0,
        max: 3,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        textStyle: {
          color: mode === "dark" ? "#A1A1AA" : "#71717A",
        },
        inRange: {
          color:
            mode === "dark"
              ? ["#18181B", "#065F46", "#059669", "#10B981"] // dark greens
              : ["#F0F9FF", "#7DD3FC", "#38BDF8", "#0EA5E9"], // light blues
        },
      },
      calendar: {
        top: 60,
        left: 30,
        right: 30,
        cellSize: ["auto", 20],
        range: [data[0][0], data[data.length - 1][0]],
        itemStyle: {
          borderWidth: 0.5,
          borderColor: mode === "dark" ? "#27272A" : "#E5E7EB",
        },
        yearLabel: { show: false },
        dayLabel: {
          color: mode === "dark" ? "#A1A1AA" : "#71717A",
        },
        monthLabel: {
          color: mode === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data,
      },
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [mode]);

  return (
    <Box
      ref={chartRef}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 300,
      }}
    />
  );
}
