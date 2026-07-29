import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ZONES = [
  {
    y1: 125,
    y2: 150,
    color: "#22C55E",
    label: "Normal",
    value: "≥ 125 mm",
  },
  {
    y1: 115,
    y2: 125,
    color: "#F59E0B",
    label: "Modéré",
    value: "115–124 mm",
  },
  {
    y1: 80,
    y2: 115,
    color: "#EF4444",
    label: "Sévère",
    value: "< 115 mm",
  },
];

const SAMPLE_DATA = [
  { age: 0, muac: 110 },
  { age: 1, muac: 111 },
  { age: 2, muac: 112 },
  { age: 3, muac: 113.5 },
  { age: 4, muac: 115 },
  { age: 5, muac: 116 },
  { age: 6, muac: 117 },
  { age: 7, muac: 118.5 },
  { age: 8, muac: 119.5 },
  { age: 9, muac: 120.5 },
  { age: 10, muac: 121.5 },
  { age: 11, muac: 123 },
  { age: 12, muac: 124.5 },
];

export default function MuacAgeChart({
  data = SAMPLE_DATA,
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-2">

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 relative">
        <span className="absolute left-0 text-xl">📏</span>

        <h2 className="text-[16px] font-semibold text-gray-900 text-center">
          MUAC pour l'âge (OMS)
        </h2>
      </div>

      <div className="w-full">
        <span className="text-[13px] text-gray-500 ml-2">
          MUAC (mm)
        </span>

        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart
            data={data}
            margin={{
              top: 5,
              right: 105,
              left: -32,
              bottom: 15,
            }}
          >
            {ZONES.map((z) => (
              <ReferenceArea
                key={z.label}
                y1={z.y1}
                y2={z.y2}
                fill={z.color}
                fillOpacity={0.22}
                ifOverflow="visible"
                label={{
                  value: `${z.zscore}\n${z.label.replace(" ", "\n")}`,
                  position: "right",
                  offset: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  fill:
                    z.label === "Normal"
                      ? "#22C55E"
                      : z.label === "Modéré"
                      ? "#F59E0B"
                      : "#EF4444",
                }}
              />
            ))}

            <ReferenceLine
              y={125}
              stroke="#22C55E"
              strokeDasharray="5 5"
              label={{
                value: "125 mm",
                position: "right",
                fill: "#22C55E",
                fontSize: 12,
              }}
            />

            <ReferenceLine
              y={115}
              stroke="#EF4444"
              strokeDasharray="5 5"
              label={{
                value: "115 mm",
                position: "right",
                fill: "#EF4444",
                fontSize: 12,
              }}
            />

            <XAxis
              dataKey="age"
              type="number"
              domain={[0, 12]}
              ticks={[0,1,2,3,4,5,6,7,8,9,10,11,12]}
              tick={{ fontSize: 12, fill: "#555" }}
              tickLine={false}
              axisLine={{ stroke: "#ccc" }}
              label={{
                value: "Âge (mois)",
                position: "bottom",
                offset:0 ,
                fontSize: 12,
                fill: "#666",
              }}
            />

            <YAxis
              domain={[80,150]}
              ticks={[80,90,100,110,120,130,140,150]}
              tick={{ fontSize: 12, fill: "#555" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(v) => `${v} mm`}
              labelFormatter={(l) => `${l} mois`}
            />

            <Line
              type="monotone"
              dataKey="muac"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{
                r: 5,
                fill: "#2563EB",
                stroke: "#fff",
                strokeWidth: 1.5,
              }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}