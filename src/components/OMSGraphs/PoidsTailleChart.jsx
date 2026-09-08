import Chart from "./Chart";

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

export default function PoidsTailleChart({ data = SAMPLE_DATA }) {
  return (
    <Chart
      icon="⚖️"
      title="Poids pour la taille "
      unitLabel="Poids (kg)"
      data={data}
      xKey="taille"
      yKey="poids"
      xLabel="Taille (cm)"
      xDomainDefault={[45, 105]}
      xStep={5}
      yStart={1}
      yStep={2}
      yMinDefaultCount={9}
      tooltipXUnit="cm"
      tooltipYUnit="kg"
    />
  );
}
