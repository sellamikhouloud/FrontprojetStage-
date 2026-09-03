import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import ReportTabs from "../../components/Report/ReportTabs";
import YearPicker from "../../components/Report/YearPicker";
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
import { getRapportAnnuel, validerRapport, genererPdfRapport } from "@/lib/api/Rapport";
import { getEmailsRapport } from "@/lib/api/Parametres";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const formatDateSlash = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

const RapportAnnuel = () => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [rapport, setRapport] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [isValidating, setIsValidating] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showEmailsListReadOnly, setShowEmailsListReadOnly] = useState(false);

  const requestIdRef = useRef(0);

  const handleYearChange = async (value) => {
    setSelectedYear(value.year);
    setRapport(null);
    setStatus(STATUS.LOADING);

    const currentRequestId = ++requestIdRef.current;

    try {
      const response = await getRapportAnnuel(value.year);

      if (currentRequestId !== requestIdRef.current) return;

      setRapport(response.data[0] ?? null);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Erreur lors du chargement du rapport annuel :", error);

      if (currentRequestId !== requestIdRef.current) return;

      setRapport(null);
      setStatus(STATUS.ERROR);
    }
  };

  useEffect(() => {
    handleYearChange({ year: currentYear });
  }, []);

  const {
    data: emailsData,
    isLoading: emailsLoading,
    isError: emailsError,
  } = useQuery({
    queryKey: ["emails-rapport", "annuel"],
    queryFn: () =>
      getEmailsRapport({ type_rapport: "annuel" }).then((r) => r.data),
    enabled: showEmailsListReadOnly,
  });

  const emailsBruts = emailsData?.results ?? emailsData ?? [];

  const emails = emailsBruts.map((item) => ({
    id: item.id,
    label: item.email,
    date: formatDateSlash(item.date_creation),
  }));

  const handleOpenEmailsList = () => {
    setShowEmailsListReadOnly(true);
  };

  const isLoading = status === STATUS.LOADING;

  const getPourcentage = (statut) =>
    rapport?.donnees?.statut_nutritionnel?.find((s) => s.statut === statut)
      ?.pourcentage ?? 0;

  const products = rapport
    ? Object.entries(rapport.donnees.distributions).map(([product, details]) => ({
        product,
        quantity: details.quantite,
        unit: details.unite,
      }))
    : [];

  const handleValidation = async () => {
    if (!rapport) return;
    setIsValidating(true);

    try {
      await validerRapport(rapport.id);
      setRapport((prev) => (prev ? { ...prev, est_valide: true } : prev));
    } catch (error) {
      console.error("Erreur lors de la validation du rapport :", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!rapport) return;

    try {
      const response = await genererPdfRapport(rapport.id);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Rapport-${rapport.type}-${rapport.annee}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF :", error);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar role="admin" />

      <main className="flex-1 h-screen overflow-hidden px-4 md:px-6 lg:px-8 pt-16 lg:pt-6 pb-6 flex flex-col">
        <div className={`${showPreview ? "hidden" : "block"} lg:block flex-shrink-0`}>
          <NavigationHeader title="Rapports" />
        </div>

        <div className={`mt-4 lg:mt-6 ${showPreview ? "hidden" : "block"} lg:block flex-shrink-0`}>
          <ReportTabs />
        </div>

        <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row items-start gap-6 lg:gap-8 flex-1 min-h-0 overflow-hidden">
          {/* Zone d'aperçu du rapport */}
          <div
            className={`
              ${showPreview ? "flex" : "hidden"}
              lg:flex
              flex-1
              h-full
              w-full
              rounded-[15px]
              bg-[#F8FBFC]
              p-4
              md:p-6
              flex-col
              gap-6
              overflow-y-auto
              scrollbar-hide
            `}
          >
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-[#202124] font-medium lg:hidden"
            >
              <X size={18} />
              Revenir
            </button>

            <div className="mt-2">
              <HeaderRapport selectedYear={selectedYear} title="Rapport Annuel" />
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Spinner />
              </div>
            )}

            {status === STATUS.ERROR && (
              <p className="text-center text-red-500 mt-6">
                Une erreur est survenue lors du chargement du rapport.
              </p>
            )}

            {status === STATUS.SUCCESS && !rapport && (
              <p className="text-center text-[#818181] mt-6">
                Aucun rapport disponible pour l'année {selectedYear}.
              </p>
            )}

            {status === STATUS.SUCCESS && rapport && (
              <>
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-full max-w-[720px]">
                    <h2 className="text-[16px] lg:text-[18px] font-semibold text-[#202124] mb-3">
                      États des familles en fin d'année {selectedYear}
                    </h2>

                    <div className="flex w-full gap-3">
                      <StatusCard
                        value={rapport.donnees.familles.nb_actives ?? 0}
                        label="Actives"
                        type="active"
                      />
                      <StatusCard
                        value={rapport.donnees.familles.nb_alertees ?? 0}
                        label="Alertées"
                        type="alert"
                      />
                      <StatusCard
                        value={rapport.donnees.familles.nb_sortie ?? 0}
                        label="Sorties"
                        type="sortie"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="w-full max-w-[720px]">
                    <ReportVisitsNutrition
                      realised={rapport.donnees.visites.nb_realisees ?? 0}
                      planned={rapport.donnees.visites.nb_prevus ?? 0}
                      compliance={
                        rapport.donnees.visites.nb_prevus
                          ? Math.round(
                              (rapport.donnees.visites.nb_realisees /
                                rapport.donnees.visites.nb_prevus) *
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

                <div className="mt-4 flex justify-center">
                  <div className="w-full max-w-[720px]">
                    <h2 className="text-[16px] lg:text-[18px] font-semibold text-[#202124] mb-4">
                      Distributions année {selectedYear}
                    </h2>

                    <div className="space-y-3">
                      {products.map((item, index) => (
                        <DistributionItem
                          key={index}
                          product={item.product}
                          quantity={item.quantity}
                          unit={item.unit}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <CardZakatSummary
                    montant={`${(
                      rapport.donnees.zakat.montant_total_verse_ce_mois ?? 0
                    ).toLocaleString("fr-FR")} MRU`}
                    familles={rapport.donnees.zakat.nb_familles_ce_mois ?? 0}
                  />
                </div>
              </>
            )}
          </div>

          {/* Panneau de configuration de droite */}
          <div
            className={`
              ${showPreview ? "hidden" : "flex"}
              lg:flex
              w-full
              h-full
              lg:w-[360px]
              xl:w-[420px]
              2xl:w-[540px]
              lg:min-w-[340px]
              flex-col
              lg:pt-2
              overflow-y-auto
              scrollbar-hide
            `}
          >
            {isLoading ? (
              <div className="min-h-[44px] sm:min-h-[48px] rounded-[15px] border border-[#EDEDED] bg-[#F3F3F3] animate-pulse w-full" />
            ) : (
              <div
                className="
                  min-h-[44px] sm:min-h-[48px]
                  rounded-[15px]
                  border
                  flex items-center justify-center
                  text-center
                  px-3
                  py-2.5
                  text-xs sm:text-sm lg:text-base
                  leading-snug
                  font-semibold
                  break-words
                  w-full
                "
                style={{
                  backgroundColor: rapport?.est_valide ? "#B5ECC926" : "#F8F8F8",
                  borderColor: rapport?.est_valide ? "#22C55E" : "#818181",
                  color: rapport?.est_valide ? "#22C55E" : "#818181",
                }}
              >
                {rapport?.est_valide
                  ? "La vérification a été effectuée avec succès. Le rapport sera envoyé ultérieurement."
                  : "En attente de vérification"}
              </div>
            )}

            <div className="mt-4 w-full">
              <YearPicker value={selectedYear} onChange={handleYearChange} />
            </div>

            <button
              type="button"
              onClick={handleOpenEmailsList}
              className="
                mt-4
                flex items-center gap-1.5
                text-[13px] sm:text-[14px] lg:text-[15px]
                font-semibold
                text-[#202124]
                w-fit
                hover:opacity-70
                active:scale-[0.97]
                transition
              "
            >
              Consulter la liste des emails destinataires du rapport
              <img src={UpRight} alt="" className="w-4 h-4" />
            </button>

            <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <div className="lg:hidden">
                <Button
                  title="Prévoir le rapport"
                  variant="telecharger"
                  onClick={() => setShowPreview(true)}
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
                disabled={isLoading || !rapport}
              />

              {!isLoading && rapport && !rapport.est_valide && (
                <Button
                  title="Confirmer et valider"
                  variant="primary"
                  noPadding
                  onClick={handleValidation}
                  disabled={isValidating}
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
        onClose={() => setShowEmailsListReadOnly(false)}
        searchPlaceholder="Entrer l'email à chercher"
        emptyMessage={
          emailsLoading
            ? "Chargement..."
            : emailsError
            ? "Erreur lors du chargement des emails."
            : "Aucun destinataire pour l'instant."
        }
        showDelete={false}
      />
    </div>
  );
};

export default RapportAnnuel;
