import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import ReportTabs from "../../components/Report/ReportTabs";
import MonthPicker from "../../components/Report/MonthPicker";
import Button from "../../components/Button/Button";
import Download from "../../assets/telecharger.svg";
import CardZakatSummary from "../../components/Report/CardZakatSummary";
import HeaderRapport from "../../components/Report/HeaderRapport";
import StatusCard from "../../components/Report/ReportBadge";
import ReportVisitsNutrition from "../../components/Report/ReportVisitsNutrition";
import DistributionItem from "../../components/Report/DistributionItem";
import UpRight from "../../assets/Up Right.svg";
import ListManagerDialog from "../../components/Popups/ListManagerDialog";
import Spinner from "../../components/Spinner";

import {
  getRapportMensuel,
  validerRapport,
  genererPdfRapport,
} from "@/lib/api/Rapport";

const RapportMensuel = () => {
  const MONTH_NAMES = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const now = new Date();

  const [selectedMonth, setSelectedMonth] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [rapport, setRapport] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showEmailsListReadOnly, setShowEmailsListReadOnly] = useState(false);

  const [emails] = useState([
    {
      id: 1,
      label: "direction@nutrigest.mr",
      date: "04/08/2026",
    },
    {
      id: 2,
      label: "comptabilite@nutrigest.mr",
      date: "04/08/2026",
    },
    {
      id: 3,
      label: "comptabilite@nutrigest.mr",
      date: "04/08/2026",
    },
    {
      id: 4,
      label: "comptabilite@nutrigest.mr",
      date: "04/08/2026",
    },
    {
      id: 5,
      label: "comptabilite@nutrigest.mr",
      date: "04/08/2026",
    },
    {
      id: 6,
      label: "comptabilite@nutrigest.mr",
      date: "04/08/2026",
    },
  ]);


  const getMonthlyCacheKey = (year, month) => {
    return `rapport-mensuel-${year}-${month}`;
  };

  const getCachedReport = (year, month) => {
    try {
      const key = getMonthlyCacheKey(year, month);
      const cached = sessionStorage.getItem(key);

      if (!cached) {
        return null;
      }

      return JSON.parse(cached);
    } catch (error) {
      console.error("Erreur lecture cache rapport mensuel :", error);
      return null;
    }
  };

  const saveReportToCache = (data) => {
    if (!data) return;

    try {
      const key = getMonthlyCacheKey(data.annee, data.mois);

      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Erreur sauvegarde cache rapport mensuel :", error);
    }
  };

 

  const handleMonthChange = async (value) => {
    if (!value?.year || !value?.month) {
      return;
    }

    const year = Number(value.year);
    const month = Number(value.month);

    const newSelectedMonth = {
      year,
      month,
    };

    setSelectedMonth(newSelectedMonth);

    const cachedReport = getCachedReport(year, month);

    if (cachedReport) {
      setRapport(cachedReport);
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await getRapportMensuel(year, month);

      const data = response?.data?.[0] ?? null;

      setRapport(data);

      // Sauvegarder le résultat
      if (data) {
        saveReportToCache(data);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement du rapport mensuel :",
        error
      );

      setRapport(null);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    const initialYear = now.getFullYear();
    const initialMonth = now.getMonth() + 1;

    handleMonthChange({
      year: initialYear,
      month: initialMonth,
    });
  }, []);

  

  const getPourcentage = (statut) => {
    return (
      rapport?.donnees?.statut_nutritionnel?.find(
        (item) => item.statut === statut
      )?.pourcentage ?? 0
    );
  };

  

  const products = rapport?.donnees?.distributions
    ? Object.entries(rapport.donnees.distributions).map(
        ([product, details]) => ({
          product,
          quantity: details?.quantite ?? 0,
          unit: details?.unite ?? "",
        })
      )
    : [];

  

  const handleValidation = async () => {
    if (!rapport?.id) {
      return;
    }

    setIsValidating(true);

    try {
      await validerRapport(rapport.id);

      const updatedReport = {
        ...rapport,
        est_valide: true,
      };

      // Mise à jour UI
      setRapport(updatedReport);

      // Mise à jour cache
      saveReportToCache(updatedReport);
    } catch (error) {
      console.error(
        "Erreur lors de la validation du rapport :",
        error
      );
    } finally {
      setIsValidating(false);
    }
  };

  

  const handleDownloadPdf = async () => {
    if (!rapport?.id) {
      return;
    }

    try {
      const response = await genererPdfRapport(rapport.id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `rapport-${rapport.type}-${rapport.mois ?? "annuel"}-${rapport.annee}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Erreur lors du téléchargement du PDF :",
        error
      );
    }
  };

 

  const monthName =
    MONTH_NAMES[(selectedMonth.month ?? 1) - 1];

  const selectedMonthLabel = `${monthName} ${selectedMonth.year}`;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-screen overflow-hidden px-5 pt-18 md:pt-0 pb-8 lg:p-10">

      
        <div
          className={`${showPreview ? "hidden" : "block"} xl:block`}
        >
          <NavigationHeader title="Rapports" />
        </div>

       
        <div
          className={`mt-6 ${showPreview ? "hidden" : "block"} xl:block`}
        >
          <ReportTabs />
        </div>

     
        <div className="mt-8 flex flex-col xl:flex-row items-start gap-8 h-[calc(100%-120px)]">

        

          <div
            className={`
              ${showPreview ? "flex" : "hidden"}
              xl:flex
              flex-1
              h-full
              w-full
              rounded-[15px]
              bg-[#F8FBFC]
              p-4
              md:p-6
              flex-col
              gap-8
              overflow-y-auto
              scrollbar-hide
            `}
          >
          
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-[#202124] font-medium xl:hidden"
            >
              <X size={18} />
              Revenir
            </button>

          
            <div className="mt-4">
              <HeaderRapport
                selectedMonth={
                  rapport
                    ? {
                        month: rapport.mois,
                        year: rapport.annee,
                        monthName:
                          MONTH_NAMES[
                            (rapport.mois ?? 1) - 1
                          ],
                        label: `${
                          MONTH_NAMES[
                            (rapport.mois ?? 1) - 1
                          ]
                        } ${rapport.annee}`,
                      }
                    : {
                        ...selectedMonth,
                        monthName,
                        label: selectedMonthLabel,
                      }
                }
                title="Rapport Mensuel"
              />
            </div>

           
            {loading && (
              <div className="flex justify-center items-center py-10">
                <Spinner />
              </div>
            )}

          
            {!loading && !rapport && (
              <p className="text-center text-[#818181] mt-6">
                Aucun rapport disponible pour ce mois.
              </p>
            )}

           
            {!loading && rapport && (
              <>
                {/* FAMILLES */}
                <div className="mt-4 flex flex-col items-center">
                  <div className="w-full max-w-[720px]">

                    <h2 className="text-[18px] font-semibold text-[#202124] mb-3">
                      États des familles
                    </h2>

                    <div className="flex w-full gap-3">
                      <StatusCard
                        value={
                          rapport?.donnees?.familles
                            ?.nb_actives ?? 0
                        }
                        label="Actives"
                        type="active"
                      />

                      <StatusCard
                        value={
                          rapport?.donnees?.familles
                            ?.nb_alertees ?? 0
                        }
                        label="Alertées"
                        type="alert"
                      />

                      <StatusCard
                        value={
                          rapport?.donnees?.familles
                            ?.nb_sortie ?? 0
                        }
                        label="Sorties"
                        type="sortie"
                      />
                    </div>
                  </div>
                </div>

             
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-[720px]">

                    <ReportVisitsNutrition
                      realised={
                        rapport?.donnees?.visites
                          ?.nb_realisees ?? 0
                      }
                      planned={
                        rapport?.donnees?.visites
                          ?.nb_prevus ?? 0
                      }
                      compliance={
                        rapport?.donnees?.visites?.nb_prevus
                          ? Math.round(
                              (rapport.donnees.visites
                                .nb_realisees /
                                rapport.donnees.visites
                                  .nb_prevus) *
                                100
                            )
                          : 0
                      }
                      normal={getPourcentage("normal")}
                      mam={getPourcentage("mam")}
                      mas={getPourcentage("mas")}
                    />

                  </div>
                </div>

                
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-[720px]">

                    <h2 className="text-[18px] font-semibold text-[#202124] mb-4">
                      Distributions ce mois
                    </h2>

                    <div className="space-y-3">
                      {products.map((item, index) => (
                        <DistributionItem
                          key={`${item.product}-${index}`}
                          product={item.product}
                          quantity={item.quantity}
                          unit={item.unit}
                        />
                      ))}
                    </div>

                  </div>
                </div>

                {/* ZAKAT */}
                <div className="flex items-center justify-center">
                  <CardZakatSummary
                    montant={`${(
                      rapport?.donnees?.zakat
                        ?.montant_total_verse_ce_mois ?? 0
                    ).toLocaleString("fr-FR")} MRU`}
                    familles={
                      rapport?.donnees?.zakat
                        ?.nb_familles_ce_mois ?? 0
                    }
                  />
                </div>
              </>
            )}
          </div>


          <div
            className={`
              ${showPreview ? "hidden" : "flex"}
              xl:flex
              w-full
              h-full
              xl:w-[420px]
              2xl:w-[540px]
              xl:min-w-[380px]
              2xl:min-w-[540px]
              flex-col
              xl:pt-7
              overflow-y-auto
              scrollbar-hide
            `}
          >

           
            <div
              className="
                min-h-[44px]
                sm:min-h-[48px]
                rounded-[15px]
                border
                flex
                items-center
                justify-center
                text-center
                px-3
                py-2.5
                text-xs
                sm:text-sm
                md:text-base
                leading-snug
                font-semibold
                break-words
                w-full
              "
              style={{
                backgroundColor:
                  rapport?.est_valide
                    ? "#B5ECC926"
                    : "#F8F8F8",

                borderColor:
                  rapport?.est_valide
                    ? "#22C55E"
                    : "#818181",

                color:
                  rapport?.est_valide
                    ? "#22C55E"
                    : "#818181",
              }}
            >
              {loading
                ? "Chargement du rapport..."
                : rapport?.est_valide
                ? "La vérification a été effectuée avec succès. Le rapport sera envoyé ultérieurement."
                : rapport
                ? "En attente de vérification"
                : "Aucun rapport disponible"}
            </div>

          
            <div className="mt-4 w-full">
              <MonthPicker
                onChange={handleMonthChange}
              />
            </div>

           
            <button
              type="button"
              onClick={() =>
                setShowEmailsListReadOnly(true)
              }
              className="
                mt-4
                flex
                items-center
                gap-1.5
                text-[14px]
                sm:text-[12px]
                md:text-[16px]
                font-semibold
                text-[#202124]
                w-fit
                hover:opacity-70
                active:scale-[0.97]
                transition
              "
            >
              Consulter la liste des emails destinataires du rapport

              <img
                src={UpRight}
                alt=""
                className="w-4 h-4"
              />
            </button>

         
            <div
              className="
                mt-6
                flex
                flex-col
                sm:flex-row
                xl:flex-col
                gap-2
                w-full
              "
            >
            
              <div className="xl:hidden">
                <Button
                  title="Prévoir le rapport"
                  variant="telecharger"
                  onClick={() =>
                    setShowPreview(true)
                  }
                  noPadding
                />
              </div>

           
              <Button
                title="Télécharger PDF"
                icon={Download}
                iconPosition="left"
                variant="telecharger"
                noPadding
                onClick={handleDownloadPdf}
                disabled={!rapport || loading}
              />

            
              {!rapport?.est_valide && (
                <Button
                  title={
                    isValidating
                      ? "Validation..."
                      : "Confirmer et valider"
                  }
                  variant="primary"
                  noPadding
                  onClick={handleValidation}
                  disabled={
                    isValidating ||
                    !rapport ||
                    loading
                  }
                />
              )}
            </div>
          </div>
        </div>
      </main>

    
      <ListManagerDialog
        open={showEmailsListReadOnly}
        title="Emails destinataires des rapports"
        items={emails}
        onClose={() =>
          setShowEmailsListReadOnly(false)
        }
        emptyMessage="Aucun destinataire pour l'instant."
        showDelete={false}
      />
    </div>
  );
};

export default RapportMensuel;
