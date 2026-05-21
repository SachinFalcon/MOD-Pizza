"use client";
/**
 * components/telemetry/screen-health-heatmap.tsx
 * Apache ECharts heatmap showing screen uptime by outlet × hour.
 * Data is fed from useActivityHeatmap() TanStack Query hook.
 */
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useActivityHeatmap } from "@/hooks/use-telemetry";

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`
);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScreenHealthHeatmap() {
  const { data: matrix, isLoading } = useActivityHeatmap();

  const option = useMemo(() => {
    if (!matrix) return {};

    // Flatten to [hour, day, value] triples for ECharts heatmap
    const seriesData: [number, number, number][] = [];
    matrix.forEach((row, h) =>
      row.forEach((val, d) => seriesData.push([h, d, val]))
    );

    return {
      backgroundColor: "transparent",
      tooltip: {
        position: "top",
        formatter: (p: { data: [number, number, number] }) =>
          `${DAYS[p.data[1]]} ${HOURS[p.data[0]]}: <b>${p.data[2]}%</b> activity`,
      },
      grid: { top: "8%", bottom: "14%", left: "8%", right: "4%" },
      xAxis: {
        type: "category",
        data: HOURS,
        axisLabel: {
          fontSize: 9,
          color: "#94a3b8",
          interval: 2,
          rotate: 0,
        },
        splitArea: { show: true },
      },
      yAxis: {
        type: "category",
        data: DAYS,
        axisLabel: { fontSize: 11, color: "#475569", fontWeight: "bold" },
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        itemWidth: 12,
        itemHeight: 100,
        textStyle: { fontSize: 10, color: "#94a3b8" },
        inRange: {
          color: ["#fff1f2", "#fecdd3", "#f87171", "#ef4444", "#BD1720"],
        },
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: { show: false },
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
