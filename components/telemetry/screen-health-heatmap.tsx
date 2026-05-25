"use client";
/**
 * components/telemetry/screen-health-heatmap.tsx
 * Apache ECharts heatmap showing screen uptime by outlet × hour.
 * Data is fed from useActivityHeatmap() TanStack Query hook.
 */
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useActivityHeatmap } from "@/hooks/use-telemetry";

const DISPLAY_HOURS = ["09:00 AM", "12:00 PM", "03:00 PM", "05:00 PM", "09:00 PM"];
const HOUR_INDICES = [9, 12, 15, 17, 21];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function ScreenHealthHeatmap() {
  const { data: matrix, isLoading } = useActivityHeatmap();

  const option = useMemo(() => {
    if (!matrix) return {};

    // Flatten to [dayIndex, hourIndex, value] triples for ECharts heatmap
    const seriesData: [number, number, number][] = [];
    HOUR_INDICES.forEach((h, i) => {
      DAYS.forEach((_, d) => {
        // xIndex = d (DAYS), yIndex = i (DISPLAY_HOURS)
        seriesData.push([d, i, matrix[h][d]]);
      });
    });

    return {
      backgroundColor: "transparent",
      tooltip: {
        position: "top",
        formatter: (p: { data: [number, number, number] }) =>
          `${DAYS[p.data[0]]} ${DISPLAY_HOURS[p.data[1]]}: <b>${p.data[2]}%</b> activity`,
      },
      grid: { top: "5%", bottom: "0%", left: "12%", right: "2%" },
      xAxis: {
        type: "category",
        data: DAYS,
        axisLabel: {
          fontSize: 10,
          color: "#94a3b8",
          fontWeight: "600",
          margin: 12,
        },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: DISPLAY_HOURS,
        inverse: true, // 09:00 AM at the top
        axisLabel: { 
          fontSize: 10, 
          color: "#94a3b8", 
          fontWeight: "500",
          margin: 16,
        },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      visualMap: {
        show: false, // Hidden because the image has a custom HTML legend instead
        min: 0,
        max: 100,
        calculable: true,
        inRange: {
          color: ["#FFF0F1", "#FFCCD0", "#FAA0A9", "#F26D7D", "#D84A5C"], 
        },
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: { show: false },
          itemStyle: {
            borderRadius: 2, // reduced curvature
            borderWidth: 3, // reduced spacing (controls gap between blocks)
            borderColor: "#fff", 
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(189,23,32,0.5)",
            },
          },
        },
      ],
    };
  }, [matrix]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-pulse">
        <div className="w-full h-full bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: 260, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
    />
  );
}
