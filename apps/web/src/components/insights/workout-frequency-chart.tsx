"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export function WorkoutFrequencyChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Sample data - replace with real data
    const data = [
      { date: "2024-01-01", count: 2 },
      { date: "2024-01-02", count: 1 },
      { date: "2024-01-03", count: 3 },
      { date: "2024-01-04", count: 0 },
      { date: "2024-01-05", count: 2 },
      { date: "2024-01-06", count: 1 },
      { date: "2024-01-07", count: 2 },
    ];

    const option = {
      backgroundColor: "transparent", // Make chart background transparent
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} workouts",
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.date),
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      yAxis: {
        type: "value",
        name: "Workouts",
        minInterval: 1,
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      series: [
        {
          data: data.map((d) => d.count),
          type: "bar",
          name: "Workouts",
          itemStyle: {
            color: theme === "dark" ? "#10B981" : "#0EA5E9", // emerald-500 : blue-500
          },
          emphasis: {
            itemStyle: {
              color: theme === "dark" ? "#059669" : "#0284C7", // emerald-600 : blue-600
            },
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
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
  }, [theme]);

  return (
    <div
      ref={chartRef}
      className="w-full h-full min-h-[300px] bg-zinc-100 dark:bg-stone-900"
    />
  );
}
