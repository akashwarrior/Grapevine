"use client";

import { useMemo } from "react";
import { HistoricalDataPoint } from "@/lib/types";
import { filterHistoricalDataByPeriod } from "@/lib/utils/generate-historical-data";

interface MarketChartProps {
  outcomes: Array<{
    name: string;
    probability: number;
    color: string;
  }>;
  historicalData?: HistoricalDataPoint[];
  period?: string;
}

export function MarketChart({ outcomes, historicalData = [], period = "ALL" }: MarketChartProps) {
  // Filter historical data based on selected period
  const data = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return [];
    }
    return filterHistoricalDataByPeriod(historicalData, period);
  }, [historicalData, period]);

  // If no data, show empty state
  if (data.length === 0) {
    return (
      <div className="h-70 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No historical data available</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 1000;
  const height = 280;
  const padding = { top: 20, right: 50, bottom: 40, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values for scaling
  const allValues = data.flatMap((d) => Object.values(d.values));
  const minValue = Math.max(0, Math.min(...allValues) - 10);
  const maxValue = Math.min(100, Math.max(...allValues) + 10);

  // Scale functions
  const scaleX = (index: number) => (index / (data.length - 1)) * chartWidth;
  const scaleY = (value: number) => chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  // Generate path for each outcome
  const generatePath = (outcomeName: string) => {
    let isFirst = true;
    return data
      .map((d, i) => {
        const value = d.values[outcomeName];
        if (value === undefined) return null;
        const x = Math.round(scaleX(i) * 100) / 100; // Round to 2 decimal places
        const y = Math.round(scaleY(value) * 100) / 100;
        const cmd = isFirst ? `M ${x} ${y}` : `L ${x} ${y}`;
        isFirst = false;
        return cmd;
      })
      .filter(Boolean)
      .join(" ");
  };

  // Format timestamp for x-axis
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (period === "1H" || period === "6H") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (period === "1D" || period === "1W") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Generate y-axis labels
  const yAxisLabels = [0, 20, 40, 60, 80, 100];

  // Generate x-axis labels (show 6 evenly spaced labels)
  const xAxisLabelIndices = [0, Math.floor(data.length * 0.2), Math.floor(data.length * 0.4), Math.floor(data.length * 0.6), Math.floor(data.length * 0.8), data.length - 1];

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
      >
        {/* Grid lines */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Horizontal grid lines */}
          {yAxisLabels.map((value) => {
            const yPos = Math.round(scaleY(value) * 100) / 100;
            return (
              <g key={value}>
                <line
                  x1={0}
                  y1={yPos}
                  x2={chartWidth}
                  y2={yPos}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.08"
                  className="text-muted-foreground"
                />
                {/* Right-side Y-axis labels like Polymarket */}
                <text
                  x={chartWidth + 10}
                  y={yPos}
                  textAnchor="start"
                  alignmentBaseline="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          {/* Vertical grid lines */}
          {xAxisLabelIndices.map((index, i) => {
            const xPos = Math.round(scaleX(index) * 100) / 100;
            return (
              <line
                key={`vline-${i}`}
                x1={xPos}
                y1={0}
                x2={xPos}
                y2={chartHeight}
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.05"
                className="text-muted-foreground"
              />
            );
          })}

          {/* Chart lines for each outcome */}
          {outcomes.map((outcome) => {
            const lastValue = data[data.length - 1]?.values[outcome.name];
            // Skip rendering if no data exists for this outcome
            if (lastValue === undefined) return null;

            return (
              <g key={outcome.name}>
                {/* Line path */}
                <path
                  d={generatePath(outcome.name)}
                  fill="none"
                  stroke={outcome.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                  opacity="0.9"
                />

                {/* Current value dot */}
                <circle
                  cx={Math.round(scaleX(data.length - 1) * 100) / 100}
                  cy={Math.round(scaleY(lastValue) * 100) / 100}
                  r="5"
                  fill={outcome.color}
                  stroke={outcome.color}
                  strokeWidth="2"
                  className="transition-all duration-300"
                  opacity="1"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {xAxisLabelIndices.map((index, i) => {
            const xPos = Math.round(scaleX(index) * 100) / 100;
            return (
              <text
                key={`xlabel-${i}`}
                x={xPos}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground font-normal"
              >
                {formatTimestamp(data[index].timestamp)}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

