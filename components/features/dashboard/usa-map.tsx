"use client";

import React from "react";
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
// @ts-ignore
import { scaleLinear } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const data = [
  { state: "Texas", value: 85 },
  { state: "California", value: 72 },
  { state: "New York", value: 64 },
  { state: "Florida", value: 90 },
  { state: "Washington", value: 45 },
  { state: "Illinois", value: 78 },
  { state: "Georgia", value: 55 },
  { state: "Ohio", value: 30 },
  { state: "Michigan", value: 25 },
  { state: "Pennsylvania", value: 40 },
];

const colorScale = scaleLinear<string>()
  .domain([0, 100])
  .range(["#FEE2E2", "#A91D22"]); // Using the modRed for the high end

  export function USAMap() {
    return (
      <div className="w-full relative flex flex-col h-full justify-between">
        <div className="w-full flex items-center justify-center py-2 md:py-0">
          <ComposableMap projection="geoAlbersUsa" className="w-full h-auto max-h-[280px] md:max-h-[450px]">
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const cur = data.find((s) => s.state === geo.properties.name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={cur ? colorScale(cur.value) : "#E1DCD3"}
                      stroke="rgba(247, 241, 233, 0.35)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#FCA5A5", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
  
        {/* Map Legend (from high-fidelity screenshot) */}
        <div className="mt-4 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-1.5 w-full md:w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-500">Low Coverage</span>
              <span className="text-[12px] font-medium text-slate-500">High Coverage</span>
            </div>
            <div className="flex items-center space-x-[2px] w-full">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="h-2.5 flex-1 rounded-sm"
                  style={{ backgroundColor: colorScale(i * 11.1) }}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-[#FFF1F2] px-3.5 py-2 rounded-[6px]">
              <p className="text-[12px] text-slate-600 font-medium">
                Color intensity reflects campaign coverage across states
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
