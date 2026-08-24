import {
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22C55E", "#F59E0B", "#BA1A1A"];

const ReportVisitsNutrition = ({
  realised = 9,
  planned = 21,
  compliance = 43,
  normal = 65,
  mam = 25,
  mas = 10,
}) => {
  const data = [
    { name: "Normal", value: normal },
    { name: "MAM", value: mam },
    { name: "MAS", value: mas },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr] gap-6 md:gap-8 lg:gap-10 items-start">

     
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-black mb-3 lg:mb-5">
            Nombre de visites
          </h2>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-none text-[#7BC8C4]">
                {realised}
              </div>

              <p className="text-xs sm:text-sm text-[#6D7A73] mt-1.5">
                Réalisées
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-none text-[#4A4A4A]">
                {planned}
              </div>

              <p className="text-xs sm:text-sm text-[#6D7A73] mt-1.5">
                Prévues ce mois
              </p>
            </div>
          </div>

          <div className="mt-5 lg:mt-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm sm:text-base font-semibold text-[#202124]">
                Taux de compliance
              </span>

              <span className="text-sm sm:text-base text-[#202124] font-medium">
                {compliance}%
              </span>
            </div>

            <div className="w-full h-2 sm:h-3 rounded-full bg-[#E7F2F1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7BC8C4]"
                style={{
                  width: `${Math.min(100, Math.max(0, compliance))}%`,
                }}
              />
            </div>
          </div>
        </div>

      
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 lg:mb-5 text-black">
            État nutritionnel global
          </h2>

          <div
            className="
              flex
              items-center
              justify-between
              sm:justify-start
              gap-4
              sm:gap-6
              lg:gap-8
              flex-wrap
              min-w-0
            "
          >

        
            <div className="space-y-2.5 sm:space-y-3">

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />

                <span className="text-xs sm:text-sm text-[#000000] whitespace-nowrap">
                  Normal {normal}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />

                <span className="text-xs sm:text-sm text-[#000000] whitespace-nowrap">
                  MAM {mam}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />

                <span className="text-xs sm:text-sm text-[#000000] whitespace-nowrap">
                  MAS {mas}%
                </span>
              </div>

            </div>

            
            <div
              className="
                shrink-0
                aspect-square
                w-[100px]
                xs:w-[110px]
                sm:w-[120px]
                lg:w-[150px]
                [&>div]:!w-full
                [&>div]:!h-full
                [&_svg]:!w-full
                [&_svg]:!h-full
              "
            >
              <PieChart
                width={150}
                height={150}
              >
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="100%"
                  stroke="none"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportVisitsNutrition;
