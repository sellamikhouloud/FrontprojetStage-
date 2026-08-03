import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import ReportTabs from "../components/Report/ReportTabs";
import MonthPicker from "../components/Report/MonthPicker";
import Button from "../components/Button/Button";
import Download from "../assets/telecharger.svg";
import CardZakatSummary from "../components/Report/CardZakatSummary";
import HeaderRapport from "../components/Report/HeaderRapport";
import StatusCard  from  "../components/Report/ReportBadge";

const RapportMensuel = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [rapport, setRapport] = useState(null);

  const handleMonthChange = async (value) => {
  setSelectedMonth(value);

  console.log("Mois sélectionné :", value);

  // Quand ton backend sera prêt :
  //
  // const response = await axios.get("/api/reports/monthly", {
  //   params: {
  //     month: value.month,
  //     year: value.year,
  //   },
  // });
  //
  // setRapport(response.data);
};

  
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar role="admin" />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10">
       <NavigationHeader
        title="Rapports"
/>

        {/* Onglets */}
        <div className="mt-6">
          <ReportTabs />
        </div>

        {/* Contenu */}
        <div className="mt-8 flex flex-col xl:flex-row items-start gap-8">
  
{/* Partie gauche */}
 <div
  className="
    flex-1
    w-full
    rounded-[15px]
    bg-[#F8FBFC]
    min-h-[500px]
    lg:min-h-[650px]
    p-4
    md:p-6
    flex
    flex-col
    gap-8
  "
>
<div className="mt-4">
  <HeaderRapport
    selectedMonth={selectedMonth}
    title="Rapport Mensuel"
  />
</div>

 <div className="mt-4 flex flex-col items-center">
  <div className="w-full max-w-[720px]">
    <h2 className="text-[18px] font-semibold text-[#202124] mb-3">
      États des familles
    </h2>

    <div className="flex w-full gap-3">
      <StatusCard value={38} label="Actives" type="active" />
      <StatusCard value={1} label="Alertées" type="alert" />
      <StatusCard value={5} label="Sorties" type="sortie" />
    </div>
  </div>
</div>

 <div className=" flex items-center justify-center">
  <CardZakatSummary
    montant="2,450,000 MRU"
    familles={32}
  />
</div>

</div>

    <div
  className="
    w-full
    xl:w-[540px]
    xl:min-w-[540px]

    flex
    flex-col

    xl:pt-7
  "
>
  <div
  className="h-[48px] rounded-[15px] border flex items-center justify-center"
  style={{
    backgroundColor: "#F8F8F8",
    borderColor: "#818181",
    color: "#818181",
  }}
>
  En attente de vérification
</div>

<div className="mt-4">
  <MonthPicker onChange={handleMonthChange} />
</div>

<div className="mt-6 flex flex-col">
  <Button
    title="Télécharger PDF"
    icon={Download}
    iconPosition="left"
    variant="telecharger"
    noPadding
  />

  <Button
    title="Confirmer et envoyer"
    variant="primary"
    noPadding
  />
</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RapportMensuel;