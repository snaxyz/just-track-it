"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export function PersonalRecordsChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Mock data - replace with real data
    const data = [
      { exercise: "Deadlift", weight: 315, date: "2024-02-01" },
      { exercise: "Squat", weight: 275, date: "2024-01-15" },
      { exercise: "Bench Press", weight: 225, date: "2024-01-20" },
      { exercise: "Overhead Press", weight: 135, date: "2024-02-05" },
      { exercise: "Barbell Row", weight: 185, date: "2024-01-25" },
    ];

    const option = {
      backgroundColor: "transparent",
      title: {
        // text: "Personal Records",
        left: "center",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>Weight: ${data.value}lbs<br/>Date: ${data.data.date}`;
        },
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.exercise),
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Weight (lbs)",
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      series: [
        {
          data: data.map((d) => ({
            value: d.weight,
            date: d.date,
            itemStyle: {
              color: theme === "dark" ? "#10B981" : "#0EA5E9",
            },
          })),
          type: "bar",
          barWidth: "40%",
          emphasis: {
            itemStyle: {
              color: theme === "dark" ? "#059669" : "#0284C7",
            },
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
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

  return <div ref={chartRef} className="w-full h-full min-h-[300px]" />;
}
