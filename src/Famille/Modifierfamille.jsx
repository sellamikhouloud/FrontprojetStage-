// SRC/PAGES/FAMILLES/MODIFYFAMILLY.JSX
import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import {
  getFamille,
  updateFamille,
  marquerSortie,
  getVisites,
  getDistributions,
  getFamilleZakat,
} from "@/lib/api/familles";

import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import InfoCard from "../../components/Containers/AfficherContainer";
import EditableInfoCard from "../../components/Containers/ModifierContainer";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatusBadge from "../../components/Cards/Badge";
import PopupDistributionfamille from "../../components/Popups/PopupDistributionfamille";
import Popupvisites from "../../components/Popups/Popupvisitefamille";
import PopupZakatFamille from "../../components/Popups/PopupZakatfamille";
import PopupListeCoordinateurs from "../../components/Popups/PopupListeCoordinateurs";
import PopupFinSuivi from "../../components/Popups/PopupFinsuivi";
import Popup from "../../components/Popups/SuccessPopup.jsx";
import Button from "../../components/Button/Button";
import MotherPhoto from "../../assets/photo mere.svg";
import successImage from "../../assets/Success.svg";
import Spinner from "../../components/Spinner";

/* ============================================================
   Part 9 rule: only pull out the fields THIS FORM actually edits.
   Never id, code, date_creation, etc — those are read-only and
   would always look "changed" since we never write them back.
   ============================================================ */
function extractEditableFields(famille) {
  return {
    date_entree: famille?.date_entree ?? null,

    nourrisson_date_naissance: famille?.nourrisson?.date_naissance ?? null,
    nourrisson_sexe: famille?.nourrisson?.sexe ?? "",
    nourrisson_poids_naissance: famille?.nourrisson?.poids_naissance ?? "",
    nourrisson_taille_naissance: famille?.nourrisson?.taille_naissance ?? "",

    mere_village_id: famille?.mere?.village?.id ?? null,
    mere_telephone: famille?.mere?.telephone ?? "",
    mere_date_naissance: famille?.mere?.date_naissance ?? null,
    mere_statut_matrimonial: famille?.mere?.statut_matrimonial ?? "",
    mere_nb_enfants: famille?.mere?.nb_enfants ?? "",
    mere_referent_medical: famille?.mere?.referent_medical ?? "",
    mere_informations_complementaires:
      famille?.mere?.informations_complementaires ?? "",

    coordinateur_id: famille?.coordinateur?.id ?? null,

    date_sortie: famille?.date_sortie ?? null,
    motif_sortie: famille?.motif_sortie ?? "",
  };
}

/* Simple extraction d'erreur, inline, sans fichier séparé */
function getErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return "Erreur réseau. Vérifiez votre connexion.";
  if (data.detail) return data.detail;
  if (typeof data === "object") return "Certains champs sont invalides.";
  return "Une erreur est survenue.";
}

/* Mêmes mappings que FamilyProfile.jsx, pour afficher les statuts */
const STATUT_BEBE = {
  normale: { text: "Bébé normal", type: "mereNormal" },
  Normale: { text: "Bébé normal", type: "mereNormal" },
  mam: { text: "MAM nourrisson", type: "mam" },
  "Malnutrition Aiguë Modérée": { text: "MAM nourrisson", type: "mam" },
  mas: { text: "MAS nourrisson", type: "mas" },
  "Malnutrition Aiguë Sévère": { text: "MAS nourrisson", type: "mas" },
};

const STATUT_MERE = {
  normale: { text: "Mère normale", type: "mereNormal" },
  Normale: { text: "Mère normale", type: "mereNormal" },
  a_risque: { text: "Mère à risque", type: "mereActive" },
  "À risque": { text: "Mère à risque", type: "risque" },
  malnutrition: { text: "Malnutrition", type: "mas" },
  Malnutrition: { text: "Malnutrition", type: "mas" },
};

const Modifyfamilly = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [openZakat, setOpenZakat] = useState(false);
  const [openDistribution, setOpenDistribution] = useState(false);
  const [openVisites, setOpenVisites] = useState(false);
  const [openFinSuivi, setOpenFinSuivi] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openCoordinateur, setOpenCoordinateur] = useState(false);

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  /* 1. Load the current record */
  const {
    data: famille,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["famille", id],
    queryFn: () => getFamille(id).then((res) => res.data),
    enabled: !!id,
  });

  const { data: visitesResponse, isLoading: visitesLoading } = useQuery({
    queryKey: ["visites", id],
    queryFn: () => getVisites(id).then((r) => r.data),
    enabled: !!id && openVisites,
  });
  const visitesData = Array.isArray(visitesResponse)
    ? visitesResponse
    : visitesResponse?.results || (visitesResponse ? [visitesResponse] : []);

  const { data: distributionsResponse, isLoading: distributionsLoading } = useQuery({
    queryKey: ["distributions", id],
    queryFn: () => getDistributions(id).then((res) => res.data),
    enabled: !!id && openDistribution,
  });
  const distributionsData = Array.isArray(distributionsResponse)
    ? distributionsResponse
    : distributionsResponse?.results ||
      (distributionsResponse ? [distributionsResponse] : []);

  const { data: zakatResponse, isLoading: zakatLoading } = useQuery({
    queryKey: ["zakat", id],
    queryFn: () => getFamilleZakat(id).then((res) => res.data),
    enabled: !!id && openZakat,
  });
  const zakatsData = Array.isArray(zakatResponse)
    ? zakatResponse
    : zakatResponse?.results || (zakatResponse ? [zakatResponse] : []);

  /* 2. Snapshot the loaded fields as "baseline" — the reference point */
  const baseline = useMemo(
    () => (famille ? extractEditableFields(famille) : null),
    [famille]
  );

  /* 3. Working copy — the user edits this */
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (baseline && !form) setForm(baseline);
  }, [baseline, form]);

  /* 4. On every render, calculate what changed */
  const patch = useMemo(
    () => (baseline && form ? diffPatch(baseline, form) : {}),
    [baseline, form]
  );
  const nothingChanged = isEmptyPatch(patch);

  /* 5. The save mutation */
  const saveMut = useMutation({
    mutationFn: (patch) => updateFamille(id, patch).then((r) => r.data),
    onSuccess: (updated) => {
      setForm(extractEditableFields(updated));
      queryClient.setQueryData(["famille", id], updated);
      queryClient.invalidateQueries({ queryKey: ["familles"] });
      setErrors({});
      setErrorMessage(null);
      setOpenSuccess(true);
    },
    onError: (err) => {
      const data = err?.response?.data;
      if (data && typeof data === "object" && !data.detail) {
        setErrors(data);
      }
      setErrorMessage(getErrorMessage(err));
    },
  });

  /* 6. The Save button handler */
  const handleSave = () => {
    setInfoMessage(null);
    setErrorMessage(null);

    // DEBUG TEMPORAIRE — à retirer une fois le point 3 résolu.
    // Vérifie dans la console : si "patch envoyé" est {} malgré un champ
    // modifié, le bug est dans EditableInfoCard (onChange mal branché).
    console.log("baseline:", baseline);
    console.log("form:", form);
    console.log("patch envoyé:", patch);

    if (nothingChanged) {
      setInfoMessage("Aucune modification à enregistrer.");
      return;
    }
    saveMut.mutate(patch);
  };

  if (isLoading) {
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

  if (!form) return <Spinner />;

  /* ==== Champs "Informations administratives" (Enregistré par restauré) ==== */
  const programme = [
    {
      key: "date_entree",
      label: "Date d'entrée dans le programme",
      value: form.date_entree ? new Date(form.date_entree) : null,
      type: "date",
    },
    {
      key: "enregistre_par",
      label: "Enregistré par",
      value: famille?.audit?.cree_par
        ? `${famille.audit.cree_par.prenom} ${famille.audit.cree_par.nom}`
        : "/",
      readOnly: true,
    },
  ];

  const nourrisson = [
    {
      key: "nourrisson_date_naissance",
      label: "Date de naissance",
      value: form.nourrisson_date_naissance
        ? new Date(form.nourrisson_date_naissance)
        : null,
      type: "date",
    },
    {
      key: "nourrisson_sexe",
      label: "Sexe",
      value:
        form.nourrisson_sexe === "M"
          ? "Masculin"
          : form.nourrisson_sexe === "F"
          ? "Féminin"
          : form.nourrisson_sexe || "Masculin",
      options: ["Masculin", "Féminin"],
    },
    {
      key: "nourrisson_poids_naissance",
      label: "Poids de naissance",
      value: form.nourrisson_poids_naissance,
      type: "number",
      unit: "g",
    },
    {
      key: "nourrisson_taille_naissance",
      label: "Taille de naissance",
      value: form.nourrisson_taille_naissance,
      type: "number",
      unit: "cm",
    },
  ];

  const mere = [
    {
      key: "mere_village_id",
      label: "Village",
      value: form.mere_village_id,
      options: [
        { value: 1, label: "Lexeiba" },
        { value: 2, label: "Rosso" },
      ],
    },
    {
      key: "mere_telephone",
      label: "Téléphone",
      value: form.mere_telephone,
      type: "phone",
    },
    {
      key: "mere_date_naissance",
      label: "Date de naissance",
      value: form.mere_date_naissance ? new Date(form.mere_date_naissance) : null,
      type: "date",
    },
    {
      key: "mere_statut_matrimonial",
      label: "Statut matrimonial",
      value: form.mere_statut_matrimonial,
      options: ["Mariée", "Célibataire", "Divorcée", "Veuve"],
    },
    {
      key: "mere_nb_enfants",
      label: "Nombre d'enfants à charge",
      value: form.mere_nb_enfants,
      type: "number",
    },
    {
      key: "mere_referent_medical",
      label: "Référent médical",
      value: form.mere_referent_medical,
    },
    {
      key: "mere_informations_complementaires",
      label: "Informations complémentaires",
      value: form.mere_informations_complementaires,
      type: "textarea",
    },
  ];

  const statutSortie = [
    {
      key: "date_sortie",
      label: "Date de sortie",
      value: form.date_sortie ? new Date(form.date_sortie) : null,
      type: "date",
    },
    {
      key: "motif_sortie",
      label: "Motif de sortie",
      value: form.motif_sortie,
      type: "textarea",
    },
  ];

  const zakat = [
    { label: "Nombre d'aides", value: famille?.zakat?.nombre ?? 0 },
    { label: "Montant total", value: `${famille?.zakat?.montant_total ?? 0} MRU` },
  ];
  const distributions = [
    { label: "Nombre de distributions", value: famille?.distributions?.nombre ?? 0 },
  ];
  const visites = [
    { label: "Nombre de visites", value: famille?.visites?.nombre ?? 0 },
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

  const coordinateurNom = famille?.coordinateur
    ? `${famille.coordinateur.nom} ${famille.coordinateur.prenom}`
    : "/";

  const statut = famille?.statut;
  const statutBebe = STATUT_BEBE[famille?.statut_nutritionnel_bebe] || null;
  const statutMere = STATUT_MERE[famille?.statut_nutritionnel_mere] || null;

  /* ==== Handlers ==== */
  const makeHandler = (fields) => (index, value) => {
    const field = fields[index];
    if (field?.readOnly) return;
    const key = field.key;
    const finalValue =
      key === "nourrisson_sexe" ? (value === "Masculin" ? "M" : "F") : value;
    setForm((prev) => ({ ...prev, [key]: finalValue }));
  };

  const handleProgrammeChange = makeHandler(programme);
  const handleNourrissonChange = makeHandler(nourrisson);
  const handleMereChange = makeHandler(mere);
  const handleStatutSortieChange = makeHandler(statutSortie);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar role="admin" />

      <PopupDistributionfamille
        open={openDistribution}
        onClose={() => setOpenDistribution(false)}
        Distribution={distributionsData}
        famille={famille}
        isLoading={distributionsLoading}
      />

      <PopupZakatFamille
        open={openZakat}
        onClose={() => setOpenZakat(false)}
        zakats={zakatsData}
        famille={famille}
        isLoading={zakatLoading}
      />

      <Popupvisites
        open={openVisites}
        onClose={() => setOpenVisites(false)}
        Visites={visitesData}
        famille={famille}
        isLoading={visitesLoading}
      />

      <PopupFinSuivi
        open={openFinSuivi}
        onClose={() => setOpenFinSuivi(false)}
        onConfirm={async (motif, dateSortie) => {
          try {
            await marquerSortie(famille.id, {
              date_sortie: dateSortie.toISOString().split("T")[0],
              motif_sortie: motif,
            });
            setOpenFinSuivi(false);
            queryClient.invalidateQueries({ queryKey: ["famille", id] });
          } catch (err) {
            setErrorMessage(getErrorMessage(err));
          }
        }}
      />

      {openSuccess && (
        <Popup
          title="Modifications enregistrées"
          image={successImage}
          primaryButtonText="Voir la fiche de la famille"
          onPrimaryClick={() => {
            setOpenSuccess(false);
            navigate(`/famille/${id}`, {
              state: { from: location.state?.from, draft: location.state?.draft },
            });
          }}
        />
      )}

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={() => window.history.back()}
        />

        <NavigationHeader
          title="Fiche famille"
          type="save"
          actionTitle={saveMut.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
          onAction={handleSave}
          disabled={nothingChanged || saveMut.isPending}
        />

        {errorMessage && (
          <div className="mb-4 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        {infoMessage && (
          <div className="mb-4 rounded-[10px] border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 text-sm">
            {infoMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[520px_minmax(0,1fr)] gap-6 xl:gap-10 mb-8">
          <div className="w-full lg:w-[520px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[331px] rounded-[15px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
            <img
              src={famille?.mere?.photo || MotherPhoto}
              alt="Photo de la mère"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-h-[331px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[26px] font-bold text-[#202124]">
                {famille?.mere?.prenom} {famille?.mere?.nom}
              </h2>
              <span className="text-[#67A7A3] text-[18px] font-semibold">
                {famille?.id}
              </span>
            </div>

            {/* Statuts : famille + bébé + mère */}
            <div className="flex flex-col gap-2">
              <StatusBadge
                type={statut?.toLowerCase() === "sortie" ? "sortie" : "mereActive"}
                text={statut?.toLowerCase() === "sortie" ? "Sortie" : "Active"}
                className="w-full h-[40px] rounded-[10px]"
              />

              <div className="grid grid-cols-2 gap-1">
                {statutBebe && (
                  <StatusBadge
                    type={statutBebe.type}
                    text={statutBebe.text}
                    className="w-full h-[40px] rounded-[10px]"
                  />
                )}
                {statutMere && (
                  <StatusBadge
                    type={statutMere.type}
                    text={statutMere.text}
                    className="w-full h-[40px] rounded-[10px]"
                  />
                )}
              </div>
            </div>

            <div className="-mt-3">
              <EditableInfoCard
                title="Informations administratives"
                data={programme}
                editable={true}
                onChange={handleProgrammeChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-3">
              <div className="flex flex-col gap-4">
                <InfoCard
                  title="Zakat aid"
                  action="Voir tous"
                  onActionClick={() => setOpenZakat(true)}
                  data={zakat}
                />
                <InfoCard data={modification} />
              </div>

              <div className="flex flex-col gap-2">
                <InfoCard
                  title="Distributions"
                  action="Voir en détails"
                  onActionClick={() => setOpenDistribution(true)}
                  data={distributions}
                />
                <EditableInfoCard
                  title="Supervisé par"
                  data={[{ label: "Nom du coordinateur", value: coordinateurNom, popup: true }]}
                  editable={true}
                  onChange={() => {}}
                  onPopupClick={() => setOpenCoordinateur(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-3">
          <div className="flex flex-col gap-4">
            <EditableInfoCard
              title="Informations nourrisson"
              data={nourrisson}
              editable={true}
              onChange={handleNourrissonChange}
            />
            <InfoCard
              title="Visites"
              action="Voir tous"
              onActionClick={() => setOpenVisites(true)}
              data={visites}
            />
          </div>

          <div className="flex flex-col gap-4">
            <EditableInfoCard
              title="Informations mère"
              data={mere}
              editable={true}
              onChange={handleMereChange}
            />
          </div>
        </div>

        {statut?.toLowerCase() === "active" && (
          <div className="mt-8 w-full">
            <Button
              title="Sortir du programme"
              variant="primary"
              noPadding
              onClick={() => setOpenFinSuivi(true)}
            />
          </div>
        )}

        {statut?.toLowerCase() === "sortie" && (
          <div className="mt-8">
            <EditableInfoCard
              title="Statut sortie"
              data={statutSortie}
              editable={true}
              onChange={handleStatutSortieChange}
            />
          </div>
        )}

        <PopupListeCoordinateurs
          open={openCoordinateur}
          onClose={() => setOpenCoordinateur(false)}
          onSelectCoordinateur={(coordinateur) => {
            setForm((prev) => ({ ...prev, coordinateur_id: coordinateur.id }));
            setOpenCoordinateur(false);
          }}
        />
      </main>
    </div>
  );
};

export default Modifyfamilly;
