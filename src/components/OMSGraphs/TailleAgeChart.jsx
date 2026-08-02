import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
 
// Zones de référence OMS pour la taille-pour-âge (en cm, valeurs approx. pour l'exemple 0-12 mois)
// À remplacer par les vrais seuils de z-score OMS (LMS) si besoin de précision clinique.
const ZONES = [
  { y1: 92, y2: 100, color: "#EF4444", zscore: "+3", label: "Élevé" },
  { y1: 82, y2: 92,  color: "#F59E0B", zscore: "+2", label: "Risque élevé" },
  { y1: 55, y2: 82,  color: "#22C55E", zscore: "0",  label: "Normal" },
  { y1: 50, y2: 55,  color: "#F59E0B", zscore: "−2", label: "Risque faible" },
  { y1: 40, y2: 50,  color: "#EF4444", zscore: "−3", label: "Faible" },
];
 
// Couleur de texte associée à chaque zone (pour les labels de droite)
const TEXT_COLOR = {
  "Élevé": "#EF4444",
  "Risque élevé": "#F59E0B",
  "Normal": "#22C55E",
  "Risque faible": "#F59E0B",
  "Faible": "#EF4444",
};
 
/**
 * Affiche la courbe de taille d'un enfant par rapport aux zones de référence OMS,
 * avec un style "carnet de santé" : icône règle, fond blanc arrondi,
 * labels de zone à droite avec le z-score associé.
 *
 * @param {Array<{age: number, taille: number}>} data - points de mesure (age en mois, taille en cm)
 */
const SAMPLE_DATA = [
  { age: 0, taille: 57.5 },
  { age: 1, taille: 60.5 },
  { age: 2, taille: 63 },
  { age: 3, taille: 65.5 },
  { age: 4, taille: 68 },
  { age: 5, taille: 70.5 },
  { age: 6, taille: 73 },
  { age: 7, taille: 75 },
  { age: 8, taille: 77 },
  { age: 9, taille: 79 },
  { age: 10, taille: 80.5 },
  { age: 11, taille: 81.5 },
  { age: 12, taille: 82.5 },
];
 
export default function TailleAgeChart({ data = SAMPLE_DATA }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
      {/* En-tête */}
      <div className="flex items-center justify-center gap-2 mb-1 relative">
        <span className="absolute left-0 text-xl">📏</span>
        <h2 className="text-[18px] font-semibold text-gray-900 text-center">
          Taille pour l'âge (OMS)
        </h2>
      </div>
 
      <div className="flex items-start">
        {/* Label Y en haut à gauche, comme sur la maquette */}
        <div className="w-full">
          <span className="text-[13px] text-gray-500 ml-2">Taille (cm)</span>
 
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={data} margin={{ top: 5, right: 90, left: -35, bottom: 15}}>
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
                allowDataOverflow={false}
                label={{
                  value: "Âge (mois)",
                  position: "bottom",
                  offset: 0,
                  fontSize: 12,
                  fill: "#666",
                }}
              />
              <YAxis
                domain={[40, 100]}
                ticks={[40, 50, 60, 70, 80, 90, 100]}
                tick={{ fontSize: 12, fill: "#555" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(v) => `${v} cm`} labelFormatter={(l) => `${l} mois`} />
              <Line
                type="monotone"
                dataKey="taille"
                stroke="#2a78d6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#2a78d6", stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}