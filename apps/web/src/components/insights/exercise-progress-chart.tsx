"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export function ExerciseProgressChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Mock data - replace with real exercise data
    const data = [
      { date: "2024-01-01", weight: 135, reps: 8 },
      { date: "2024-01-08", weight: 145, reps: 8 },
      { date: "2024-01-15", weight: 145, reps: 10 },
      { date: "2024-01-22", weight: 155, reps: 8 },
      { date: "2024-01-29", weight: 155, reps: 10 },
      { date: "2024-02-05", weight: 165, reps: 8 },
    ];

    const option = {
      backgroundColor: "transparent", // Make chart background transparent
      title: {
        // text: "Bench Press Progress",
        left: "center",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const weightData = params[0];
          const repsData = params[1];
          return `${weightData.name}<br/>
                  Weight: ${weightData.value}lbs<br/>
                  Reps: ${repsData.value}`;
        },
      },
      legend: {
        data: ["Weight", "Reps"],
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.date),
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Weight (lbs)",
          position: "left",
          axisLabel: {
            color: theme === "dark" ? "#A1A1AA" : "#71717A",
          },
        },
        {
          type: "value",
          name: "Reps",
          position: "right",
          axisLabel: {
            color: theme === "dark" ? "#A1A1AA" : "#71717A",
          },
        },
      ],
      series: [
        {
          name: "Weight",
          type: "line",
          data: data.map((d) => d.weight),
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: theme === "dark" ? "#10B981" : "#0EA5E9",
          },
          symbol: "circle",
          symbolSize: 8,
        },
        {
          name: "Reps",
          type: "line",
          yAxisIndex: 1,
          data: data.map((d) => d.reps),
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: theme === "dark" ? "#8B5CF6" : "#6366F1",
          },
          symbol: "circle",
          symbolSize: 8,
        },
      ],
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
