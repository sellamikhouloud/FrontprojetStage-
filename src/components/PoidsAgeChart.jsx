import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Zones OMS (exemple)
const ZONES = [
  { y1: 12, y2: 14, color: "#EF4444", zscore: "+3", label: "Élevé" },
  { y1: 10, y2: 12, color: "#F59E0B", zscore: "+2", label: "Risque élevé" },
  { y1: 4, y2: 10, color: "#22C55E", zscore: "0", label: "Normal" },
  { y1: 2, y2: 4, color: "#F59E0B", zscore: "−2", label: "Risque faible" },
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
  { age: 0, poids: 3.2 },
  { age: 1, poids: 4.1 },
  { age: 2, poids: 5 },
  { age: 3, poids: 5.8 },
  { age: 4, poids: 6.5 },
  { age: 5, poids: 7 },
  { age: 6, poids: 7.5 },
  { age: 7, poids: 7.9 },
  { age: 8, poids: 8.3 },
  { age: 9, poids: 8.6 },
  { age: 10, poids: 8.9 },
  { age: 11, poids: 9.2 },
  { age: 12, poids: 9.5 },
];

export default function PoidsAgeChart({ data = SAMPLE_DATA }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 relative">
        <span className="absolute left-0 text-xl">⚖️</span>

        <h2 className="text-[18px] font-semibold text-gray-900 text-center">
          Poids pour l'âge (OMS)
        </h2>
      </div>

      <div className="flex items-start">
        <div className="w-full">
          <span className="text-[13px] text-gray-500 ml-2">
            Poids (kg)
          </span>

          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 90, left: -45, bottom: 15 }}
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
                    value: `${z.zscore}  ${z.label}`,
                    position: "right",
                    offset: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    fill: TEXT_COLOR[z.label],
                  }}
                />
              ))}

              <XAxis
                dataKey="age"
                type="number"
                domain={[0, 12]}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                tick={{ fontSize: 12, fill: "#555" }}
                tickLine={false}
                axisLine={{ stroke: "#ccc" }}
                label={{
                  value: "Âge (mois)",
                  position: "bottom",
                  offset: 0,
                  fontSize: 12,
                  fill: "#666",
                }}
              />

              <YAxis
                domain={[0, 14]}
                ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
                tick={{ fontSize: 12, fill: "#555" }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(v) => `${v} kg`}
                labelFormatter={(l) => `${l} mois`}
              />

              <Line
                type="monotone"
                dataKey="poids"
                stroke="#2a78d6"
                strokeWidth={2.5}
                dot={{
                  r: 5,
                  fill: "#2a78d6",
                  stroke: "#fff",
                  strokeWidth: 1.5,
                }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}