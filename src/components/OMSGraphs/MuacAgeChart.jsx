import Chart from "./Chart";

const SAMPLE_DATA = [
  { age: 0, muac: 108 },
  { age: 1, muac: 111 },
  { age: 2, muac: 113 },
  { age: 3, muac: 115 },
  { age: 4, muac: 118 },
  { age: 5, muac: 120 },
  { age: 6, muac: 122 },
  { age: 7, muac: 124 },
  { age: 8, muac: 126 },
  { age: 9, muac: 128 },
  { age: 10, muac: 130 },
  { age: 11, muac: 132 },
  { age: 12, muac: 134 },
];

export default function MuacAgeChart({ data = SAMPLE_DATA }) {
  return (
    <Chart
      icon="💪"
      title="Périmètre brachial - MUAC "
      unitLabel="MUAC (mm)"
      data={data}
      xKey="age"
      yKey="muac"
      xLabel="Âge (mois)"
      xDomainDefault={[0, 24]}
      xStep={1}
      yStart={30}
      yStep={20}
      tooltipXUnit="mois"
      tooltipYUnit="mm"
    />
  );
}
