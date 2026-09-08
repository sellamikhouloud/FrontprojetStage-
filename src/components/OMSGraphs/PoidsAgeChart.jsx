import Chart from "./Chart";

export default function PoidsAgeChart({ data = [] }) {
  return (
    <Chart
      icon="⚖️"
      title="Poids pour l'âge "
      unitLabel="Poids (kg)"
      data={data}
      xKey="age"
      yKey="poids"
      xLabel="Âge (mois)"
      xDomainDefault={[0, 24]}
      xStep={1}
      yStart={1}
      yStep={2}
      yMinDefaultCount={7}
      tooltipXUnit="mois"
      tooltipYUnit="kg"
    />
  );
}
