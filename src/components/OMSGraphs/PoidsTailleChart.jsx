import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ZONES = [
  { y1: 16, y2: 18, color: "#EF4444", zscore: "+3", label: "Élevé" },
  { y1: 13, y2: 16, color: "#F59E0B", zscore: "+2", label: "Risque élevé" },
  { y1: 5, y2: 13, color: "#22C55E", zscore: "0", label: "Normal" },
  { y1: 2, y2: 5, color: "#F59E0B", zscore: "−2", label: "Risque faible" },
  { y1: 0, y2: 2, color: "#EF4444", zscore: "−3", label: "Faible" },
];

const TEXT_COLOR = {
  "Élevé": "#EF4444",
  "Risque élevé": "#F59E0B",
  "Normal": "#22C55E",
  "Risque faible": "#F59E0B",
  "Faible": "#EF4444",
};

const SAMPLE_DATA = [
  { taille: 45, poids: 2.5 },
  { taille: 50, poids: 3.0 },
  { taille: 55, poids: 3.5 },
  { taille: 60, poids: 4.0 },
  { taille: 65, poids: 4.5 },
  { taille: 70, poids: 5.1 },
  { taille: 75, poids: 5.7 },
  { taille: 80, poids: 6.4 },
  { taille: 85, poids: 7.2 },
  { taille: 90, poids: 8.0 },
  { taille: 95, poids: 8.7 },
  { taille: 100, poids: 9.4 },
  { taille: 105, poids: 10.0 },
];

export default function PoidsTailleChart({
  data = SAMPLE_DATA,
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 relative">
        <span className="absolute left-0 text-xl">⚖️</span>

        <h2 className="text-[18px] font-semibold text-gray-900 text-center">
          Poids pour la taille (OMS)
        </h2>
      </div>

      <div className="w-full">
        <span className="text-[13px] text-gray-500 ml-2">
          Poids (kg)
        </span>

        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart
            data={data}
            margin={{
              top: 5,
              right: 90,
              left: -45,
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
                  value: `${z.zscore} ${z.label}`,
                  position: "right",
                  offset: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  fill: TEXT_COLOR[z.label],
                }}
              />
            ))}

            <XAxis
              dataKey="taille"
              type="number"
              domain={[45, 105]}
              ticks={[45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105]}
              tick={{ fontSize: 12, fill: "#555" }}
              tickLine={false}
              axisLine={{ stroke: "#ccc" }}
              label={{
                value: "Taille (cm)",
                position: "bottom",
                offset: 0,
                fontSize: 12,
                fill: "#666",
              }}
            />

            <YAxis
              domain={[0, 18]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]}
              tick={{ fontSize: 12, fill: "#555" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(v) => `${v} kg`}
              labelFormatter={(l) => `${l} cm`}
            />

            <Line
              type="monotone"
              dataKey="poids"
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