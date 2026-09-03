import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import TextArea from "../../components/Containers/Textarea";
import Spinner from "../../components/Spinner";
import { getRapportBilanDonateur, validerRapport, genererPdfRapport } from "@/lib/api/Rapport";
import { getPhoto } from "@/lib/api/galerie";

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const RapportBilan = () => {
  const buildMonthValue = (year, month) => ({
    year,
    month,
    monthName: MONTH_NAMES[(month ?? 1) - 1],
    label: `${MONTH_NAMES[(month ?? 1) - 1]} ${year}`,
  });

  const getCurrentMonthValue = () => {
    const now = new Date();
    return buildMonthValue(now.getFullYear(), now.getMonth() + 1);
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue);
  const [rapport, setRapport] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [isValidating, setIsValidating] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [narrativeMessage, setNarrativeMessage] = useState("");

  const [terrainPhotos, setTerrainPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  const requestIdRef = useRef(0);
  const photosRequestIdRef = useRef(0);

  const handleMonthChange = async (value) => {
    setSelectedMonth(buildMonthValue(value.year, value.month));
    setRapport(null);
    setNarrativeMessage("");
    setTerrainPhotos([]);
    setStatus(STATUS.LOADING);

    const currentRequestId = ++requestIdRef.current;

    try {
      const response = await getRapportBilanDonateur(value.year, value.month);

      if (currentRequestId !== requestIdRef.current) return;

      const nextRapport = response.data[0] ?? null;
      setRapport(nextRapport);
      setNarrativeMessage(nextRapport?.message ?? "");
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Erreur lors du chargement du bilan donateur :", error);

      if (currentRequestId !== requestIdRef.current) return;

      setRapport(null);
      setStatus(STATUS.ERROR);
    }
  };

  useEffect(() => {
    handleMonthChange(getCurrentMonthValue());
  }, []);

  useEffect(() => {
    const photoIds = rapport?.photos ?? [];

    if (photoIds.length === 0) {
      setTerrainPhotos([]);
      return;
    }

    const currentPhotosRequestId = ++photosRequestIdRef.current;
    setPhotosLoading(true);

    Promise.all(
      photoIds.map((id) =>
        getPhoto(id)
          .then((res) => res.data)
          .catch((error) => {
            console.error(`Erreur lors du chargement de la photo ${id} :`, error);
            return null;
          })
      )
    )
      .then((results) => {
        if (currentPhotosRequestId !== photosRequestIdRef.current) return;
        setTerrainPhotos(results.filter(Boolean));
      })
      .finally(() => {
        if (currentPhotosRequestId !== photosRequestIdRef.current) return;
        setPhotosLoading(false);
      });
  }, [rapport?.photos]);

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
      await validerRapport(rapport.id, narrativeMessage);
      setRapport((prev) =>
        prev ? { ...prev, est_valide: true, message: narrativeMessage } : prev
      );
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
      link.download = `Rapport-${rapport.type}-${rapport.mois ?? "annuel"}-${rapport.annee}.pdf`;
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

      <main className="flex-1 h-screen overflow-hidden px-4 md:px-6 min-[1000px]:px-8 pt-16 min-[1000px]:pt-6 pb-6 flex flex-col">
        {/* Navigation et Onglets */}
        <div className={`${showPreview ? "hidden" : "block"} min-[1000px]:block flex-shrink-0`}>
          <NavigationHeader title="Rapports" />
        </div>

        <div className={`mt-4 min-[1000px]:mt-6 ${showPreview ? "hidden" : "block"} min-[1000px]:block flex-shrink-0`}>
          <ReportTabs />
        </div>

        {/* Conteneur Principal */}
        <div className="mt-4 min-[1000px]:mt-6 flex flex-col min-[1000px]:flex-row items-start gap-6 min-[1000px]:gap-8 flex-1 min-h-0 overflow-hidden">
          
          {/* Section Aperçu du rapport */}
          <div
            className={`
              ${showPreview ? "flex" : "hidden"}
              min-[1000px]:flex
              flex-1
              h-full
              w-full
              flex-col
              gap-8
              overflow-y-auto
              scrollbar-hide
            `}
          >
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-[#202124] font-medium min-[1000px]:hidden"
            >
              <X size={18} />
              Revenir
            </button>

            <div
              className="
                rounded-[15px]
                bg-[#F8FBFC]
                p-4
                md:p-6
                flex
                flex-col
                gap-8
              "
            >
              <div className="mt-2">
                <HeaderRapport
                  selectedMonth={selectedMonth}
                  title="Bilan donateurs"
                />
              </div>

              {isLoading && (
                <div className="flex justify-center items-center py-10">
                  <Spinner />
                </div>
              )}

              {status === STATUS.ERROR && (
                <p className="text-center text-red-500 mt-6">
                  Une erreur est survenue lors du chargement du bilan donateur.
                </p>
              )}

              {status === STATUS.SUCCESS && !rapport && (
                <p className="text-center text-[#818181] mt-6">
                  Aucun bilan disponible pour ce mois.
                </p>
              )}

              {status === STATUS.SUCCESS && rapport && (
                <>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[720px] min-w-0">
                      <h2 className="text-[18px] font-semibold text-[#202124] mb-2">
                        Cher donateur,
                      </h2>
                      <p className="text-[14px] leading-6 whitespace-pre-wrap break-words text-[#5F6368]">
                        {narrativeMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[720px]">
                      <h2 className="text-[16px] min-[1000px]:text-[18px] font-semibold text-[#202124] mb-3">
                        États des familles
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

                  <div className="flex justify-center">
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

                  <div className="flex justify-center">
                    <div className="w-full max-w-[720px]">
                      <h2 className="text-[16px] min-[1000px]:text-[18px] font-semibold text-[#202124] mb-4">
                        Distributions ce mois
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

            {status === STATUS.SUCCESS && rapport && (
              <div
                className="
                  rounded-[15px]
                  bg-[#F8FBFC]
                  p-4
                  md:p-6
                  flex
                  flex-col
                  gap-8
                "
              >
                <HeaderRapport
                  selectedMonth={selectedMonth}
                  title="Bilan donateurs"
                />

                {photosLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Spinner />
                  </div>
                ) : terrainPhotos.length > 0 ? (
                  <div className="space-y-6">
                    {terrainPhotos.map((photo) => (
                      <div key={photo.id} className="mx-auto w-[70%]">
                        <img
                          src={photo.image}
                          alt={photo.titre || `Photo terrain ${photo.id}`}
                          className="w-full rounded-[10px] object-cover"
                        />
                        {photo.titre && (
                          <p className="mt-2 text-[17px] font-semibold text-[#202124] text-center">
                            {photo.titre}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#818181] py-6">
                    Sélectionnez les photos depuis la galerie,
                    Les photos seront affichées après la validation du rapport.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section Contrôles / Formulaire à droite */}
          <div
            className={`
              ${showPreview ? "hidden" : "flex"}
              min-[1000px]:flex
              w-full
              h-full
              min-[1000px]:w-[340px]
              xl:w-[420px]
              2xl:w-[540px]
              min-[1000px]:min-w-[320px]
              flex-col
              min-[1000px]:pt-2
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
                  text-xs sm:text-sm min-[1000px]:text-base
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

            {rapport && !rapport.est_valide && (
              <div className="mt-6 sm:mt-8">
                <TextArea
                  label="Message narratif"
                  value={narrativeMessage}
                  onChange={(e) => setNarrativeMessage(e.target.value)}
                  height="h-[140px]"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="mt-6 w-full">
              <MonthPicker onChange={handleMonthChange} />
            </div>

         <div className="mt-6 flex flex-col gap-1 w-full">
  {/* 1. Aperçu du rapport (Mobile/Tablette uniquement) */}
  <div className="min-[1000px]:hidden">
    <Button
      title="Aperçu du rapport"
      variant="telecharger"
      onClick={() => setShowPreview(true)}
      noPadding
    />
  </div>

  {/* 2. "Confirmer et valider" (Au-dessus, s'affiche si non validé) */}
  {!isLoading && rapport && !rapport.est_valide && (
    <Button
      title="Confirmer et valider"
      variant="primary"
      noPadding
      onClick={handleValidation}
      disabled={isValidating}
    />
  )}

  {/* 3. "Télécharger PDF" (En bas) */}
  <Button
    title="Télécharger PDF"
    icon={Download}
    iconPosition="left"
    variant="telecharger"
    noPadding
    onClick={handleDownloadPdf}
    disabled={isLoading || !rapport}
  />
</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RapportBilan;
