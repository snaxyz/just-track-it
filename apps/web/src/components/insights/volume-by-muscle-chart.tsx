"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

const muscleColors = {
  light: {
    Chest: "#0EA5E9", // blue-500
    Back: "#10B981", // emerald-500
    Legs: "#8B5CF6", // violet-500
    Shoulders: "#F59E0B", // amber-500
    Arms: "#EC4899", // pink-500
    Core: "#6366F1", // indigo-500
  },
  dark: {
    Chest: "#0284C7", // blue-600
    Back: "#059669", // emerald-600
    Legs: "#7C3AED", // violet-600
    Shoulders: "#D97706", // amber-600
    Arms: "#DB2777", // pink-600
    Core: "#4F46E5", // indigo-600
  },
};

export function VolumeByMuscleChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    // Mock data - replace with real data
    const data = [
      { muscle: "Chest", volume: 12000 },
      { muscle: "Back", volume: 15000 },
      { muscle: "Legs", volume: 20000 },
      { muscle: "Shoulders", volume: 8000 },
      { muscle: "Arms", volume: 6000 },
      { muscle: "Core", volume: 5000 },
    ];

    // Calculate total volume for percentage
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);

    const option = {
      backgroundColor: "transparent", // Make chart background transparent
      title: {
        // text: "Monthly Volume by Muscle Group",
        left: "center",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const percent = ((params.value / totalVolume) * 100).toFixed(1);
          return `${params.name}<br/>${params.value.toLocaleString()} lbs (${percent}%)`;
        },
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "middle",
        textStyle: {
          color: theme === "dark" ? "#A1A1AA" : "#71717A",
        },
      },
      series: [
        {
          name: "Volume",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: theme === "dark" ? "#18181B" : "#FFFFFF",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({
            name: item.muscle,
            value: item.volume,
            itemStyle: {
              color:
                theme === "dark"
                  ? muscleColors.dark[
                      item.muscle as keyof typeof muscleColors.dark
                    ]
                  : muscleColors.light[
                      item.muscle as keyof typeof muscleColors.light
                    ],
            },
          })),
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
