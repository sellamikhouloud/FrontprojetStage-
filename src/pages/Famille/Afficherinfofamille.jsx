import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getFamille } from "@/lib/api/familles";
import { marquerSortie } from "@/lib/api/familles";
import { getVisites } from "@/lib/api/familles";
import { getDistributions } from "@/lib/api/familles";
import { getFamilleZakat } from "@/lib/api/familles";
import { getCourbes } from "@/lib/api/familles";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import InfoCard from "../../components/Containers/AfficherContainer";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatusBadge from "../../components/Cards/Badge";
import PopupDistributionfamille from "../../components/Popups/PopupDistributionfamille";
import Button from "../../components/Button/Button";
import Popupvisites from "../../components/Popups/Popupvisitefamille";
import MotherPhoto from "../../assets/photo mere.svg";
import successImage from "../../assets/Success.svg";
import PopupFinSuivi from "../../components/Popups/PopupFinsuivi";
import Popup from "../../components/Popups/SuccessPopup.jsx";
import PopupZakatFamille from "../../components/Popups/PopupZakatfamille";
import OMSGraphs from "../../components/OMSGraphs/OMSGraphs.jsx";
import ZScoreBox from "../../components/Containers/ZScoreBox";
import PoidsAgeChart from "../../components/OMSGraphs/PoidsAgeChart";
import TailleAgeChart from "../../components/OMSGraphs/TailleAgeChart";
import PoidsTailleChart from "../../components/OMSGraphs/PoidsTailleChart";
import MuacAgeChart from "../../components/OMSGraphs/MuacAgeChart";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../components/Providers/AuthProvider";

const FamilyProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user, ready } = useAuth();


console.log("USER COMPLET :", user);
  const [openDistribution, setOpenDistribution] = useState(false);
  const [openVisites, setOpenVisites] = useState(false);
  const [openZakat, setOpenZakat] = useState(false);
  const [openFinSuivi, setOpenFinSuivi] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    data: famille,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["famille", id],
    queryFn: () => getFamille(id).then((res) => res.data),
    enabled: !!id && ready,
  });

  const {
    data: visitesData,
    isLoading: visitesLoading,
    isError: visitesError,
    fetchNextPage: fetchNextVisitesPage,
    hasNextPage: hasNextVisitesPage,
    isFetchingNextPage: isFetchingNextVisitesPage,
    refetch: refetchVisites,
  } = useInfiniteQuery({
    queryKey: ["visites", id],
    queryFn: ({ pageParam = 1 }) =>
      getVisites(id, { page: pageParam }).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore =
        Boolean(lastPage?.actives?.next) || Boolean(lastPage?.annulees?.next);
      return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id && openVisites,
  });

  const visitesActives = (visitesData?.pages ?? []).flatMap(
    (p) => p?.actives?.results ?? []
  );
  const visitesAnnulees = (visitesData?.pages ?? []).flatMap(
    (p) => p?.annulees?.results ?? []
  );

  const {
    data: distributionsData,
    isLoading: distributionsLoading,
    isError: distributionsError,
    fetchNextPage: fetchNextDistributionsPage,
    hasNextPage: hasNextDistributionsPage,
    isFetchingNextPage: isFetchingNextDistributionsPage,
  } = useInfiniteQuery({
    queryKey: ["distributions", id],
    queryFn: ({ pageParam = 1 }) =>
      getDistributions(id, { page: pageParam }).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore =
        Boolean(lastPage?.actives?.next) || Boolean(lastPage?.annulees?.next);
      return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id && openDistribution,
  });

  const distributionsActives = (distributionsData?.pages ?? []).flatMap(
    (p) => p?.actives?.results ?? []
  );
  const distributionsAnnulees = (distributionsData?.pages ?? []).flatMap(
    (p) => p?.annulees?.results ?? []
  );

  const {
    data: zakatData,
    isLoading: zakatLoading,
    isError: zakatError,
    fetchNextPage: fetchNextZakatPage,
    hasNextPage: hasNextZakatPage,
    isFetchingNextPage: isFetchingNextZakatPage,
    refetch: refetchZakat,
  } = useInfiniteQuery({
    queryKey: ["zakat", id],
    queryFn: ({ pageParam = 1 }) =>
      getFamilleZakat(id, { page: pageParam }).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore =
        Boolean(lastPage?.actives?.next) || Boolean(lastPage?.annulees?.next);

      return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id && openZakat,
  });

  const zakatActives = (zakatData?.pages ?? []).flatMap(
    (p) => p?.actives?.results ?? []
  );
  const zakatAnnulees = (zakatData?.pages ?? []).flatMap(
    (p) => p?.annulees?.results ?? []
  );

  const {
    data: courbesResponse,
    isLoading: courbesLoading,
    isError: courbesError,
  } = useQuery({
    queryKey: ["courbes", id],
    queryFn: () => getCourbes(id).then((res) => res.data),
    enabled: !!id,
  });

  if (!ready || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Erreur lors du chargement de la famille.
        <br />
        {error?.message}
      </div>
    );
  }

  // CORRECTION ICI:
  // Convertit les IDs en String pour éviter les incompatibilités de types (ex: number vs string)
  // Permet aux Superadmins / Admins de tout faire, et vérifie si l'ID du coordinateur correspond.
 const isCoordinateur = user?.role === "coordinator";

const coordinateurNom =
  famille?.coordinateur?.nom?.trim().toLowerCase() || "";

const coordinateurPrenom =
  famille?.coordinateur?.prenom?.trim().toLowerCase() || "";

const userNom =
  user?.nom?.trim().toLowerCase() || "";

const userPrenom =
  user?.prenom?.trim().toLowerCase() || "";

const isCoordinateurAssigne =
  isCoordinateur &&
  coordinateurNom === userNom &&
  coordinateurPrenom === userPrenom;

const isSuperviseParMoi =
  !isCoordinateur || isCoordinateurAssigne;


  console.log({
  userRole: user?.role,
  userId: user?.id,
  familleId: famille?.id,
  coordinateur: famille?.coordinateur,
  coordinateurId: famille?.coordinateur?.id,
  isCoordinateurAssigne,
  isSuperviseParMoi,
});

  const STATUT_MATRIMONIAL_LABELS = {
    mariee: "Mariée",
    celibataire: "Célibataire",
    divorcee: "Divorcée",
    veuve: "Veuve",
    decedee: "Décédée",
  };

  const nourrisson = [
    {
      label: "Prénom",
      value: famille?.nourrisson?.prenom || "/",
    },
    {
      label: "Date de naissance",
      value: famille?.nourrisson?.date_naissance
        ? famille.nourrisson.date_naissance.split("-").reverse().join("/")
        : "/",
    },
    {
      label: "Sexe",
      value:
        famille?.nourrisson?.sexe === "M"
          ? "Masculin"
          : famille?.nourrisson?.sexe === "F"
          ? "Féminin"
          : "/",
    },
    {
      label: "Poids de naissance",
      value: famille?.nourrisson?.poids_naissance
        ? `${famille.nourrisson.poids_naissance} kg`
        : "/",
    },
    {
      label: "Taille de naissance",
      value: famille?.nourrisson?.taille_naissance
        ? `${famille.nourrisson.taille_naissance} cm`
        : "/",
    },
  ];

  const mere = [
    {
      label: "Village",
      value: famille?.mere?.village?.nom || "/",
    },
    {
      label: "Numéro de téléphone",
      value: famille?.mere?.telephone || "/",
    },
    {
      label: "Date de naissance",
      value: famille?.mere?.date_naissance
        ? new Date(famille.mere.date_naissance).toLocaleDateString("fr-FR")
        : "/",
    },
    {
      label: "Statut matrimonial",
      value:
        STATUT_MATRIMONIAL_LABELS[famille?.mere?.statut_matrimonial] ||
        famille?.mere?.statut_matrimonial ||
        "/",
    },
    {
      label: "Nombre d'enfants à charge",
      value: famille?.mere?.nb_enfants ?? "/",
    },
    {
      label: "Motif de prise en charge",
      value: famille?.mere?.motif_prise_en_charge || "/",
    },
    {
      label: "Référent médical",
      value: famille?.mere?.referent_medical || "/",
    },
    {
      label: "Informations complémentaires",
      value: famille?.mere?.informations_complementaires || "/",
    },
  ];

  const programme = [
    {
      label: "Date d'entrée dans le programme",
      value: famille?.date_entree
        ? new Date(famille.date_entree).toLocaleDateString("fr-FR")
        : "/",
    },
    {
      label: "Créé par",
      value: famille?.audit?.cree_par
        ? `${famille.audit.cree_par.prenom} ${famille.audit.cree_par.nom}`
        : "/",
    },
    {
      label: "Date de création",
      value: famille?.audit?.date_creation
        ? new Date(famille.audit.date_creation).toLocaleDateString("fr-FR")
        : "/",
    },
  ];

  const zakat = [
    {
      label: "Nombre d'aides",
      value: famille?.zakat?.nombre ?? 0,
    },
    {
      label: "Montant total",
      value: `${famille?.zakat?.montant_total ?? 0} MRU`,
    },
  ];

  const distributions = [
    {
      label: "Nombre de distributions",
      value: famille?.distributions?.nombre ?? 0,
    },
  ];

  const visites = [
    {
      label: "Nombre de visites",
      value: famille?.visites?.nombre ?? 0,
    },
    {
      label: "Date de la dernière visite",
      value: famille?.visites?.derniere_visite
        ? new Date(famille.visites.derniere_visite).toLocaleDateString("fr-FR")
        : "/",
    },
  ];

  const modification = [
    {
      label: "Modifié par",
      value: famille?.audit?.modifie_par
        ? `${famille.audit.modifie_par.nom} ${famille.audit.modifie_par.prenom}`
        : "/",
    },
    {
      label: "Date de modification",
      value: famille?.audit?.date_modification
        ? new Date(famille.audit.date_modification).toLocaleDateString("fr-FR")
        : "/",
    },
  ];

  const STATUT_FAMILLE = {
    active: {
      text: "Active",
      type: "mereActive",
    },
    sortie: {
      text: "Sortie",
      type: "sortie",
    },
  };
  const statut = STATUT_FAMILLE[famille?.statut] || null;

  const STATUT_BEBE = {
    normale: {
      text: "Nourrisson normal",
      type: "mereNormal",
    },
    mam: {
      text: "MAM nourrisson",
      type: "mam",
    },
    mas: {
      text: "MAS nourrisson",
      type: "mas",
    },
  };

  const STATUT_MERE = {
    normale: {
      text: "Mère normale",
      type: "mereNormal",
    },
    a_risque: {
      text: "Mère à risque",
      type: "risque",
    },
    malnutrition: {
      text: "Mère malnutrie ",
      type: "mas",
    },
  };

  const statutBebe = STATUT_BEBE[famille?.statut_nutritionnel_bebe] || null;

  const STATUT_IMC_MERE_LABELS = {
    sous_poids: "Mère sous-poids",
    sur_poids: "Mère en surpoids",
  };

  const STATUT_HEMOGLOBINE_LABELS = {
    anemie: "Mère anémiée",
  };

  const buildStatutsMere = () => {
    const nutritionnel = famille?.statut_nutritionnel_mere;
    const imc = famille?.statut_imc_mere;
    const hemoglobine = famille?.statut_hemoglobine_mere;

    const allNull = !nutritionnel && !imc && !hemoglobine;

    if (allNull) {
      return [];
    }

    const isNormal = (v) => !v || v === "normale";

    const allNormal =
      isNormal(nutritionnel) && isNormal(imc) && isNormal(hemoglobine);

    if (allNormal) {
      return [{ text: "Mère normale", type: "mereNormal" }];
    }

    const statuts = [];

    if (
      nutritionnel &&
      nutritionnel !== "normale" &&
      STATUT_MERE[nutritionnel]
    ) {
      statuts.push({
        text: STATUT_MERE[nutritionnel].text,
        type: STATUT_MERE[nutritionnel].type,
      });
    }

    if (imc && imc !== "normale" && STATUT_IMC_MERE_LABELS[imc]) {
      statuts.push({
        text: STATUT_IMC_MERE_LABELS[imc],
        type: "mas",
      });
    }

    if (
      hemoglobine &&
      hemoglobine !== "normale" &&
      STATUT_HEMOGLOBINE_LABELS[hemoglobine]
    ) {
      statuts.push({
        text: STATUT_HEMOGLOBINE_LABELS[hemoglobine],
        type: "mas",
      });
    }

    return statuts;
  };

  const statutsMere = buildStatutsMere();

  const donneesPoidsAge = (courbesResponse?.poids_age || []).map((p) => ({
    age: p.age,
    poids: p.poids / 1000,
  }));

  const donneesTailleAge = (courbesResponse?.taille_age || []).map((t) => ({
    age: t.age,
    taille: t.taille,
  }));

  const donneesPoidsTaille = (courbesResponse?.poids_taille || []).map(
    (pt) => ({
      taille: pt.taille,
      poids: pt.poids / 1000,
    })
  );

  const donneesMuacAge = (courbesResponse?.muac_age || []).map((m) => ({
    age: m.age,
    muac: m.muac,
  }));

  const hasCourbes =
    donneesPoidsAge.length > 0 ||
    donneesTailleAge.length > 0 ||
    donneesPoidsTaille.length > 0 ||
    donneesMuacAge.length > 0;

  const graphs = [
    {
      id: 1,
      component: <PoidsAgeChart data={donneesPoidsAge} />,
    },
    {
      id: 2,
      component: <TailleAgeChart data={donneesTailleAge} />,
    },
    {
      id: 3,
      component: <PoidsTailleChart data={donneesPoidsTaille} />,
    },
    {
      id: 4,
      component: <MuacAgeChart data={donneesMuacAge} />,
    },
  ];

  const handleBack = () => {
    if (location.state?.fromPage) {
      navigate(location.state.fromPage, {
        state: {
          restoreVisiteId: location.state?.restoreVisiteId,
          restoreZakatId: location.state?.restoreZakatId,
          restoreDistributionId: location.state?.restoreDistributionId,
        },
      });
      return;
    }

    navigate(-1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar hideOnMobile />
      <PopupDistributionfamille
        open={openDistribution}
        onClose={() => setOpenDistribution(false)}
        Distribution={{
          actives: distributionsActives,
          annulees: distributionsAnnulees,
        }}
        famille={famille}
        isLoading={distributionsLoading}
        fetchNextPage={fetchNextDistributionsPage}
        hasNextPage={hasNextDistributionsPage}
        isFetchingNextPage={isFetchingNextDistributionsPage}
      />

      <PopupZakatFamille
        open={openZakat}
        onClose={() => setOpenZakat(false)}
        zakats={{
          actives: zakatActives,
          annulees: zakatAnnulees,
        }}
        famille={famille}
        isLoading={zakatLoading}
        fetchNextPage={fetchNextZakatPage}
        hasNextPage={hasNextZakatPage}
        isFetchingNextPage={isFetchingNextZakatPage}
        refetchZakat={refetchZakat}
      />

      <Popupvisites
        open={openVisites}
        onClose={() => setOpenVisites(false)}
        Visites={{
          actives: visitesActives,
          annulees: visitesAnnulees,
        }}
        famille={famille}
        isLoading={visitesLoading}
        fetchNextPage={fetchNextVisitesPage}
        hasNextPage={hasNextVisitesPage}
        isFetchingNextPage={isFetchingNextVisitesPage}
        refetchVisites={refetchVisites}
      />
      <PopupFinSuivi
        open={openFinSuivi}
        onClose={() => setOpenFinSuivi(false)}
        onConfirm={async (motif, dateSortie) => {
          await marquerSortie(famille.id, {
            date_sortie: dateSortie,
            motif_sortie: motif,
          });

          setOpenFinSuivi(false);

          await queryClient.invalidateQueries({
            queryKey: ["famille", famille.id],
          });
        }}
      />

      {openSuccess && (
        <Popup
          title="Fin de suivi avec succès"
          image={successImage}
          primaryButtonText="Voir la fiche de la famille"
          onPrimaryClick={() => {
            setOpenSuccess(false);
            setOpenFinSuivi(false);
          }}
        />
      )}

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto px-5 pt-4 md:pt-0 pb-8 lg:p-10 bg-white">
        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={handleBack}
        />

        <div className="mt-4">
          {isSuperviseParMoi ? (
            <NavigationHeader
              title="Fiche famille"
              type="edit"
              actionTitle="Modifier la fiche famille"
              onAction={() =>
                navigate(`/famille/${id}/modifier`, {
                  state: {
                    from: location.state?.from,
                    draft: location.state?.draft,
                  },
                })
              }
            />
          ) : (
            <NavigationHeader title="Fiche famille" />
          )}
        </div>

        {/* ==================== HAUT ==================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[520px_minmax(0,1fr)] gap-6 xl:gap-10 mb-8">
          {/* Photo */}
          <div className="w-full lg:w-[520px] h-[331px] rounded-[15px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
            <img
              src={famille?.mere?.photo || MotherPhoto}
              alt="Photo de la mère"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Partie droite */}
          <div className="min-h-[331px] flex flex-col gap-4">
            {/* Nom */}
            <div className="flex items-center justify-between">
              <h2 className="text-[26px] font-bold text-[#202124]">
                {famille?.mere?.nom} {famille?.mere?.prenom}
              </h2>

              <span className="text-[#67A7A3] text-[18px] font-semibold">
                {famille?.id}
              </span>
            </div>

            {/* Statuts */}
            <div className="flex flex-col gap-2">
              {statut && (
                <StatusBadge
                  type={statut.type}
                  text={statut.text}
                  className="w-full h-[40px] rounded-[10px]"
                />
              )}

              <div className="flex flex-row flex-wrap gap-2">
                {statutBebe && (
                  <StatusBadge
                    type={statutBebe.type}
                    text={statutBebe.text}
                    className="flex-1 min-w-[140px] h-[40px] rounded-[10px]"
                  />
                )}

                {statutsMere.map((s, idx) => (
                  <StatusBadge
                    key={idx}
                    type={s.type}
                    text={s.text}
                    className="flex-1 min-w-[140px] h-[40px] rounded-[10px]"
                  />
                ))}
              </div>
            </div>

            {/* Informations administratives */}
            <div className="-mt-3">
              <InfoCard
                title="Informations administratives"
                data={programme}
              />
            </div>

            {/* Zakat + Distribution et superive par */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-3">
              {/* Colonne gauche */}
              <div className="flex flex-col gap-4">
                <InfoCard
                  title="Zakat aid"
                  action="Voir tous"
                  onActionClick={() => setOpenZakat(true)}
                  data={zakat}
                />

                <InfoCard data={modification} />
              </div>

              {/* Colonne droite */}
              <div className="flex flex-col gap-2">
                <InfoCard
                  title="Distributions"
                  action="Voir en détails"
                  onActionClick={() => setOpenDistribution(true)}
                  data={distributions}
                />
                <InfoCard
                  title="Supervise par"
                  data={[
                    {
                      label: "Nom du coordinateur",
                      value: famille?.coordinateur
                        ? `${famille.coordinateur.nom} ${famille.coordinateur.prenom}`
                        : "/",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BAS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-3">
          {/* Colonne gauche */}
          <div className="flex flex-col gap-4">
            <InfoCard title="Informations nourrisson" data={nourrisson} />

            <InfoCard
              title="Visites"
              action="Voir tous"
              onActionClick={() => setOpenVisites(true)}
              data={visites}
            />
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-4">
            <InfoCard title="Informations mère" data={mere} />
          </div>
        </div>

        {/* ==================== Courbes OMS ==================== */}
        {(courbesLoading || hasCourbes) && (
          <div className="mt-4">
            {courbesLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : (
              <OMSGraphs graphs={graphs} />
            )}
          </div>
        )}

        {/* Bouton sortir du programme affiché UNIQUEMENT si la famille est active ET supervisée par le coordinateur connecté */}
        {famille?.statut === "active" && isSuperviseParMoi && (
          <div className="mt-8 w-full">
            <Button
              title="Sortir du programme"
              variant="primary"
              noPadding
              onClick={() => setOpenFinSuivi(true)}
            />
          </div>
        )}

        {famille?.statut === "sortie" && (
          <div className="mt-8">
            <InfoCard
              title="Statut sortie"
              data={[
                {
                  label: "Date de sortie",
                  value: famille?.date_sortie
                    ? new Date(famille.date_sortie).toLocaleDateString("fr-FR")
                    : "/",
                },
                {
                  label: "Motif de sortie",
                  value: famille?.motif_sortie || "/",
                },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default FamilyProfile;
