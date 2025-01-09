"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export function ConsistencyTrendChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Mock data - replace with real data
    const data = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
      workouts: Math.floor(Math.random() * 8 + 8), // 8-15 workouts per month
      streak: Math.floor(Math.random() * 5 + 1), // 1-5 day streaks
    }));

    const option = {
      backgroundColor: "transparent",
      title: {
        // text: "Monthly Consistency",
        left: "center",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const workouts = params[0];
          const streak = params[1];
          return `${workouts.name}<br/>
                  Workouts: ${workouts.value}<br/>
                  Best Streak: ${streak.value} days`;
        },
      },
      legend: {
        data: ["Workouts", "Best Streak"],
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
        top: 30,
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.month),
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Workouts",
          axisLabel: {
            color: theme === "dark" ? "#A1A1AA" : "#71717A",
          },
        },
        {
          type: "value",
          name: "Streak Days",
          axisLabel: {
            color: theme === "dark" ? "#A1A1AA" : "#71717A",
          },
        },
      ],
      series: [
        {
          name: "Workouts",
          type: "bar",
          data: data.map((d) => ({
            value: d.workouts,
            itemStyle: {
              color: theme === "dark" ? "#10B981" : "#0EA5E9",
            },
          })),
        },
        {
          name: "Best Streak",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: data.map((d) => ({
            value: d.streak,
            itemStyle: {
              color: theme === "dark" ? "#8B5CF6" : "#6366F1",
            },
          })),
          lineStyle: {
            width: 3,
          },
          symbol: "circle",
          symbolSize: 8,
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

  return <div ref={chartRef} className="w-full h-full min-h-[300px]" />;
}
