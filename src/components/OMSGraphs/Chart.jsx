import { useId } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CHART_HEIGHT = 260;

// Petit tooltip custom, plus soigné que le tooltip par défaut de recharts
function CustomTooltip({ active, payload, label, accentColor, tooltipXUnit, tooltipYUnit }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        padding: "8px 12px",
        border: `1px solid ${accentColor}33`,
      }}
    >
      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
        {label} {tooltipXUnit}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accentColor,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
          {value} {tooltipYUnit}
        </span>
      </div>
    </div>
  );
}

/**
 * Courbe de croissance simple (sans zones OMS ni labels) :
 * affiche juste "telle valeur à tel âge / telle taille".
 *
 * Les deux axes sont dynamiques :
 * - ils partent de xStart/yStart et avancent par pas de xStep/yStep
 * - si une donnée dépasse la borne haute ou basse par défaut, l'axe s'étend automatiquement
 *   pour que le point reste toujours visible (plus jamais "dans le vide").
 *
 * @param {string} accentColor - couleur d'accent du graphique (courbe, dégradé, tooltip).
 *   Permet de donner une identité visuelle différente à chaque type de courbe
 *   (ex: bleu pour le poids, vert pour la taille, orange pour le MUAC).
 */
export default function Chart({
  icon,
  title,
  unitLabel,
  data = [],
  xKey,
  yKey,
  xLabel,
  xDomainDefault = [0, 12],
  xStep = 1,
  yStart = 0,
  yStep = 2,
  yDomainDefault,
  yMinDefaultCount = 6,
  tooltipXUnit,
  tooltipYUnit,
  accentColor = "#2563EB",
}) {
  const gradientId = `chart-gradient-${useId()}`;

  // --- Axe X dynamique ---
  const xValues = data.map((d) => d[xKey]).filter((v) => typeof v === "number");
  const xMin = xDomainDefault[0];
  const xMax = Math.max(
    xDomainDefault[1],
    xValues.length ? Math.ceil(Math.max(...xValues)) : xDomainDefault[1]
  );

  const xTicks = [];
  for (let x = xMin; x <= xMax; x += xStep) xTicks.push(x);

  // --- Axe Y dynamique (s'étend vers le haut ET vers le bas si besoin) ---
  const yValues = data.map((d) => d[yKey]).filter((v) => typeof v === "number");

  const defaultMaxY = yDomainDefault ? yDomainDefault[1] : yStart + yStep * yMinDefaultCount;
  const maxDataY = yValues.length ? Math.max(...yValues) : defaultMaxY;
  let yMax = defaultMaxY;
  while (yMax < maxDataY) yMax += yStep;

  const minDataY = yValues.length ? Math.min(...yValues) : yStart;
  let yMin = yStart;
  while (yMin > minDataY) yMin -= yStep;

  const yTicks = [];
  for (let y = yMin; y <= yMax; y += yStep) yTicks.push(Math.round(y * 100) / 100);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-1">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-full text-lg shrink-0"
          style={{ background: `${accentColor}1A` }}
        >
          {icon}
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">{title}</h2>
          <span className="text-[12px] text-gray-400">{unitLabel}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={data} margin={{ top: 16, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.28} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey={xKey}
            type="number"
            domain={[xMin, xMax]}
            ticks={xTicks}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            label={{
              value: xLabel,
              position: "bottom",
              offset: 0,
              fontSize: 11,
              fill: "#9CA3AF",
            }}
          />

          <YAxis
            type="number"
            domain={[yMin, yMax]}
            ticks={yTicks}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            content={
              <CustomTooltip
                accentColor={accentColor}
                tooltipXUnit={tooltipXUnit}
                tooltipYUnit={tooltipYUnit}
              />
            }
            cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey={yKey}
            stroke="none"
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
          />

          <Line
            type="monotone"
            dataKey={yKey}
            stroke={accentColor}
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#fff", stroke: accentColor, strokeWidth: 2.5 }}
            activeDot={{
              r: 6,
              fill: accentColor,
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
