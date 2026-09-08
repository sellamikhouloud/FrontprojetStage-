import Chart from "./Chart";

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
    <Chart
      icon="📏"
      title="Taille pour l'âge "
      unitLabel="Taille (cm)"
      data={data}
      xKey="age"
      yKey="taille"
      xLabel="Âge (mois)"
      xDomainDefault={[0, 24]}
      xStep={1}
      yStart={40}
      yStep={10}
      tooltipXUnit="mois"
      tooltipYUnit="cm"
    />
  );
}
