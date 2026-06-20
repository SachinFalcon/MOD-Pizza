"use client";

import React from "react";
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Standard cities coordinates for US map markers
const MAP_MARKERS = [
  { markerOffset: -16, name: "Seattle", coordinates: [-122.33, 47.60] },
  { markerOffset: -16, name: "Los Angeles", coordinates: [-118.24, 34.05] },
  { markerOffset: 20, name: "Denver", coordinates: [-104.99, 39.73] },
  { markerOffset: 20, name: "Dallas", coordinates: [-96.79, 32.77] },
  { markerOffset: -16, name: "Chicago", coordinates: [-87.62, 41.87] },
  { markerOffset: -16, name: "New York", coordinates: [-74.00, 40.71] },
  { markerOffset: 20, name: "Atlanta", coordinates: [-84.38, 33.74] },
  { markerOffset: 20, name: "Miami", coordinates: [-80.19, 25.76] },
];

export function USAMap() {
  return (
    <div className="w-full relative flex items-center justify-center bg-transparent p-4 md:p-8 min-h-[400px]">
      <ComposableMap projection="geoAlbersUsa" className="w-full h-auto max-h-[280px] md:max-h-[450px]">
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#E5E7EB"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#D1D5DB", outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>

        {MAP_MARKERS.map(({ name, coordinates, markerOffset }) => (
          <Marker key={name} coordinates={coordinates as any}>
            {/* Scanner pulse ring */}
            <circle r={6} fill="#BD1720">
              <animate attributeName="r" begin="0s" dur="2s" values="6;24" calcMode="spline" keyTimes="0;1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
              <animate attributeName="opacity" begin="0s" dur="2s" values="0.6;0" calcMode="spline" keyTimes="0;1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
            </circle>
            {/* Solid dot */}
            <circle r={6} fill="#BD1720" stroke="#FFFFFF" strokeWidth={1.5} className="shadow-md" />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: "sans-serif", fontSize: "11px", fill: "#1E293B", fontWeight: "bold" }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

