"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export function WeightDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Mock data - replace with real data
    const data = [
      { range: "0-50", count: 15 },
      { range: "51-100", count: 25 },
      { range: "101-150", count: 35 },
      { range: "151-200", count: 28 },
      { range: "201-250", count: 18 },
      { range: "251-300", count: 8 },
      { range: "300+", count: 3 },
    ];

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "Weight Distribution (Bench Press)",
        left: "center",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} sets",
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.range + " lbs"),
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      yAxis: {
        type: "value",
        name: "Number of Sets",
        minInterval: 1,
        axisLabel: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      series: [
        {
          data: data.map((d) => ({
            value: d.count,
            itemStyle: {
              color:
                theme === "dark"
                  ? `rgba(16, 185, 129, ${0.4 + d.count / 40})` // emerald with opacity
                  : `rgba(14, 165, 233, ${0.4 + d.count / 40})`, // blue with opacity
            },
          })),
          type: "bar",
          barWidth: "60%",
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
