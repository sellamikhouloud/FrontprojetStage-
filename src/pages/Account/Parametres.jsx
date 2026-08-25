import { useState, useEffect, useMemo } from "react";
import { getTauxDeChange, updateTauxDeChange , listVillages, createVillage, updateVillage, deleteVillage , getEmailsRapport, createEmailRapport, deleteEmailRapport  } from "../../lib/api/Parametres";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import omsInfo from "../../assets/oms-info.svg";
import arrowUpRight from "../../assets/Arrow up-right.svg";
import {
  AiOutlineInfoCircle,
  AiOutlineReload,
  AiOutlineBell,
  AiOutlineDown,
  AiOutlineLineChart,
  AiOutlineExport
} from "react-icons/ai";

import { HiOutlineCurrencyEuro, HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import Button from "../../components/Button/Button";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import ListManagerDialog from "../../components/Popups/ListManagerDialog";
import VillageListDialog from "../../components/Popups/PopupVillagesListe";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../../components/Button/ToggleSwitch";
import Sidebar from "../../components/Sidebar/Sidebar";

const formaterDateCourte = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d)) return "";
  const jour = String(d.getDate()).padStart(2, "0");
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const annee = d.getFullYear();
  return `${jour}/${mois}/${annee}`;
};


export default function Parametres({ onClose }) {
 const navigate = useNavigate();

 const [taux, setTaux] = useState("");
 const [tauxInitial, setTauxInitial] = useState("");
 const [dateModification, setDateModification] = useState(null);
 const [loadingTaux, setLoadingTaux] = useState(true);
 const [erreurTaux, setErreurTaux] = useState("");
 const [savingTaux, setSavingTaux] = useState(false);

 useEffect(() => {
  const fetchTaux = async () => {
    setLoadingTaux(true);
    setErreurTaux("");
    try {
      const { data } = await getTauxDeChange();
      setTaux(data.valeur);
      setTauxInitial(data.valeur);
      setDateModification(data.date_modification);
    } catch (err) {
      if (err.response?.status === 403) {
        setErreurTaux("Vous n'avez pas les droits pour consulter le taux de change.");
      } else {
        setErreurTaux("Impossible de charger le taux de change.");
      }
      console.error(err);
    } finally {
      setLoadingTaux(false);
    }
  };

  fetchTaux();
}, []);

useEffect(() => {
  const fetchVillages = async () => {
    setLoadingRegions(true);
    setErreurRegions("");
    try {
      const { data } = await listVillages();
      setRegions(data); 
    } catch (err) {
      setErreurRegions("Impossible de charger la liste des villages.");
      console.error(err);
    } finally {
      setLoadingRegions(false);
    }
  };

  fetchVillages();
}, []);



  const [rappelOuvert, setRappelOuvert] = useState(false);

  const [frequenceRappel, setFrequenceRappel] =
    useState("Tous les mois");

  const optionsFrequence = [
    "Tous les mois",
    "Tous les 2 mois",
    "Tous les 3 mois",
    "Désactivé",
  ];


  

  const [notifVisitesRetard, setNotifVisitesRetard] = useState(false);
  const [notifAlertesMAS, setNotifAlertesMAS] = useState(true);
  const [notifAlertesStocks, setNotifAlertesStocks] = useState(true);
  const [notifRapportMensuel, setNotifRapportMensuel] = useState(true);
  const [notifBilanDonateurs, setNotifBilanDonateurs] = useState(true);
  const [notifRapportAnnuel, setNotifRapportAnnuel] = useState(true);

    // Villages
  const [nouvelleRegion, setNouvelleRegion] = useState("");
  const [regions, setRegions] = useState([]);
  const [showRegionsList, setShowRegionsList] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [erreurRegions, setErreurRegions] = useState("");
  const [erreurSuppressionRegion, setErreurSuppressionRegion] = useState("");
  const [ajoutRegionEnCours, setAjoutRegionEnCours] = useState(false);

  // Ajout d'email destinataire des rapports
  const [nouvelEmail, setNouvelEmail] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");

  
 
  const [showEmailsList, setShowEmailsList] = useState(false);

  const [emails, setEmails] = useState([]);
const [loadingEmails, setLoadingEmails] = useState(true);
const [erreurChargementEmails, setErreurChargementEmails] = useState("");
const [erreurSuppressionEmail, setErreurSuppressionEmail] = useState("");
const [ajoutEmailEnCours, setAjoutEmailEnCours] = useState(false);

// Nouveau : sélecteur type de rapport
const [typeRapportSelectionne, setTypeRapportSelectionne] = useState("annuel");
const [dropdownTypeOuvert, setDropdownTypeOuvert] = useState(false);

const optionsTypeRapport = [
  { label: "Rapport annuel", value: "annuel" },
  { label: "Rapport mensuel", value: "mensuel" },
  { label: "Les deux", value: "les_deux" },
];

const EMAIL_TYPE_FILTERS = [
  {
    value: "les_deux",
    label: "Les deux",
    selected: "bg-[#55A694] text-white border-[#55A694]",
    unselected: "bg-white text-[#55A694] border-[#55A694]",
  },
  {
    value: "annuel",
    label: "Annuel",
    selected: "bg-[#7CACF9] text-white border-[#7CACF9]",
    unselected: "bg-white text-[#7CACF9] border-[#7CACF9]",
  },
  {
    value: "mensuel",
    label: "Mensuel",
    selected: "bg-[#6CD894] text-white border-[#6CD894]",
    unselected: "bg-white text-[#6CD894] border-[#6CD894]",
  },
];

const [filtreTypeEmail, setFiltreTypeEmail] = useState("les_deux");

useEffect(() => {
  const fetchEmails = async () => {
    setLoadingEmails(true);
    setErreurChargementEmails("");
    try {
      const { data } = await getEmailsRapport();
      setEmails(data);
    } catch (err) {
      setErreurChargementEmails("Impossible de charger la liste des emails.");
      console.error(err);
    } finally {
      setLoadingEmails(false);
    }
  };

  fetchEmails();
}, []);

  const handleTauxChange = (e) => {
    const value = e.target.value;


    // Autorise uniquement les nombres avec décimales
    if (/^\d*\.?\d*$/.test(value)) {
      setTaux(value);
    }
  };

  const tauxModifie = taux.trim() !== "" && taux !== tauxInitial;

  const handleUpdate = async () => {
  if (!tauxModifie) return;

  setSavingTaux(true);
  setErreurTaux("");

  try {
    const { data } = await updateTauxDeChange(taux);
    setTaux(data.valeur);
    setTauxInitial(data.valeur);
    setDateModification(data.date_modification);
  } catch (err) {
    if (err.response?.status === 403) {
      setErreurTaux("Vous n'avez pas les droits pour modifier le taux de change.");
    } else {
      setErreurTaux("Impossible de mettre à jour le taux de change.");
    }
    console.error(err);
  } finally {
    setSavingTaux(false);
  }
};

const formaterDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


 const handleAjouterRegion = async () => {
  const nom = nouvelleRegion.trim();
  if (!nom) return;

  setAjoutRegionEnCours(true);
  setErreurRegions("");

  try {
    const { data } = await createVillage(nom);
    setRegions((prev) => [...prev, data]); // objet brut, pas mapVillage
    setNouvelleRegion("");
  } catch (err) {
    if (err.response?.status === 403) {
      setErreurRegions("Vous n'avez pas les droits pour ajouter un village.");
    } else if (err.response?.data?.nom) {
      setErreurRegions(
        Array.isArray(err.response.data.nom) ? err.response.data.nom[0] : err.response.data.nom
      );
    } else {
      setErreurRegions("Impossible d'ajouter ce village.");
    }
    console.error(err);
  } finally {
    setAjoutRegionEnCours(false);
  }
};

const handleModifierRegion = async (id, nouveauNom) => {
  const { data } = await updateVillage(id, nouveauNom);
  setRegions((prev) => prev.map((r) => (r.id === id ? data : r)));
};

    const handleSupprimerRegion = async (id) => {
    setErreurSuppressionRegion("");

    try {
      await deleteVillage(id);
      setRegions((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      if (err.response?.status === 403) {
        setErreurSuppressionRegion("Vous n'avez pas les droits pour supprimer un village.");
      } else if (err.response?.status === 400 || err.response?.status === 409) {
        setErreurSuppressionRegion(
          "Ce village est utilisé par une famille, une photo ou un utilisateur et ne peut pas être supprimé."
        );
      } else {
        setErreurSuppressionRegion("Impossible de supprimer ce village.");
      }
      console.error(err);
    }
  };

  const handleVoirToutesRegions = () => {
    setShowRegionsList(true);
  };

 const handleAjouterEmail = async () => {
  const email = nouvelEmail.trim();
  if (!email) return;

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValide) {
    setErreurEmail("Cette adresse email n'est pas valide.");
    return;
  }

  setErreurEmail("");
  setAjoutEmailEnCours(true);

  try {
    if (typeRapportSelectionne === "les_deux") {
  const [resMensuel, resAnnuel] = await Promise.all([
    createEmailRapport({ email, type_rapport: "mensuel" }),
    createEmailRapport({ email, type_rapport: "annuel" }),
  ]);
  setEmails((prev) => [...prev, resMensuel.data, resAnnuel.data]);
} else {
  const { data } = await createEmailRapport({ email, type_rapport: typeRapportSelectionne });
  setEmails((prev) => [...prev, data]);
}
    setNouvelEmail("");
  } catch (err) {
    if (err.response?.status === 403) {
      setErreurEmail("Vous n'avez pas les droits pour ajouter un destinataire.");
    } else if (err.response?.data?.email) {
      setErreurEmail(
        Array.isArray(err.response.data.email)
          ? err.response.data.email[0]
          : err.response.data.email
      );
    } else {
      setErreurEmail("Impossible d'ajouter ce destinataire.");
    }
    console.error(err);
  } finally {
    setAjoutEmailEnCours(false);
  }
};

const handleSupprimerEmail = async (id) => {
  setErreurSuppressionEmail("");
  const ids = Array.isArray(id) ? id : [id];

  try {
    await Promise.all(ids.map((i) => deleteEmailRapport(i)));
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
  } catch (err) {
    if (err.response?.status === 403) {
      setErreurSuppressionEmail("Vous n'avez pas les droits pour supprimer ce destinataire.");
    } else {
      setErreurSuppressionEmail("Impossible de supprimer ce destinataire.");
    }
    console.error(err);
  }
};

  const handleVoirTousLesEmails = () => {
    setShowEmailsList(true);
  };

 
const handleSave = () => {
  console.log("Paramètres enregistrés :", {
    taux,
    frequenceRappel,
    scoreMAMMin,
    scoreMAMMax,
    scoreMAS,
    muacMAM,
    muacMAS,
    notifVisitesRetard,
    notifAlertesMAS,
    notifAlertesStocks,
    notifRapportMensuel,
    notifBilanDonateurs,
    notifRapportAnnuel,
  });
};

const handleSelectionnerSonnerie = () => {
  console.log("Ouvrir le sélecteur de sonnerie");
  // TODO: ouvrir le dialog/popup de sélection de sonnerie
};

const emailsAffiches = useMemo(() => {
  if (filtreTypeEmail === "mensuel") {
    return emails
      .filter((e) => e.type_rapport === "mensuel")
      .map((e) => ({
        id: e.id,
        label: e.email,
        date: formaterDateCourte(e.date_creation),
        type: e.type_rapport,
      }));
  }

  if (filtreTypeEmail === "annuel") {
    return emails
      .filter((e) => e.type_rapport === "annuel")
      .map((e) => ({
        id: e.id,
        label: e.email,
        date: formaterDateCourte(e.date_creation),
        type: e.type_rapport,
      }));
  }

  const parEmail = {};
  emails.forEach((e) => {
    if (!parEmail[e.email]) parEmail[e.email] = {};
    parEmail[e.email][e.type_rapport] = e;
  });

  return Object.entries(parEmail)
    .filter(([, entries]) => entries.mensuel && entries.annuel)
    .map(([email, entries]) => ({
      id: [entries.mensuel.id, entries.annuel.id],
      label: email,
      date: formaterDateCourte(
        entries.mensuel.date_creation > entries.annuel.date_creation
          ? entries.mensuel.date_creation
          : entries.annuel.date_creation
      ),
      type: "les_deux",
    }));
}, [emails, filtreTypeEmail]);

return (
  <div className="flex h-screen bg-white overflow-hidden">
    <Sidebar
     role="admin"
     user={{
       nom: "Ahmed Mohamed",
       id: "admin",
       email: "ahmed.mohamed@gmail.com",
       telephone: "+222 00 00 00 00",
       profilePicture: "",
     }}
   />

    <main
      className="
        relative
        flex-1
        min-h-0
        overflow-hidden
        bg-white
      "
    >
        {/* Espace blanc FIXE en haut, ne scroll pas */}
  <div
    className="
      absolute
      top-0
      left-0
      right-0
      h-[20px]
      bg-white
      z-20
    "
  />
      <div
        className="
          h-full
          overflow-y-auto
          px-5
          pt-18
          md:pt-0
          lg:p-8
          pb-[50px]
        "
      >
      
        {/* ================================
            HEADER
        ================================= */}
        <PageHeader
          leftTitle="Fermer"
          showRight={false}
          onBack={() => navigate("/dashboard")}
        />

      {/* ================================
          TITRE
      ================================= */}
     <h1
  className="
    mt-1
    text-center
    text-[36px]
    font-bold
    text-[#000000]
  "
>
  Paramètres
</h1>

      <h3 className="text-[20px] font-bold text-black mt-3">
  Taux de change
</h3>
{/* ================================
    TAUX DE CHANGE
================================= */}
<div
  className="
    mt-2
    w-full
    rounded-[12px]
    border
    border-[#A7DAD8]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  {/* --------------------------------
      PARTIE 1
  --------------------------------- */}
  <div
    className="
      flex
      flex-col
      gap-2

      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:gap-4
    "
  >
    {/* Icon + titre */}
    <div className="flex items-center gap-3">

      {/* Cercle */}
      <div
        className="
          w-[48px]
          h-[48px]
          shrink-0
          rounded-full
          bg-[#EAF7F3]
          flex
          items-center
          justify-center
          text-[#4E9F8A]
        "
      >
        <HiOutlineCurrencyEuro className="text-[28px]" />
      </div>

      {/* Titre */}
      <div>
        <h2
          className="
            text-[20px]
            font-semibold
            leading-tight
            text-[#4E9F8A]
          "
        >
          Taux de change
        </h2>

        <p
          className="
            text-[18px]
            
            text-[#3E4946]
            mt-0.5
          "
        >
          EUR / MRU
        </p>
      </div>
    </div>

    {/* Dernière mise à jour */}
    <div
      className="
        flex
        items-center
        gap-2
        text-left

        sm:flex-col
        sm:items-end
        sm:gap-0
        sm:text-right
      "
    >
      <p className="text-[13px] sm:text-[16px] font- medium text-[#3E4946]">
        Dernière mise à jour
      </p>

     <p className="text-[13px] sm:text-[16px] font-bold text-[#3E4946]">
      {loadingTaux ? "..." : formaterDate(dateModification)}
     </p>
    </div>
  </div>

  
  <div className="mt-3" />

  {/* --------------------------------
      PARTIE 2
  --------------------------------- */}
  <div
  className="
    w-full
    rounded-[12px]
    bg-[#F7F9F8]

    px-4
    py-3
  "
>
  <div
    className="
      flex
      flex-col
      items-start
      gap-3

      sm:flex-row
      sm:items-center
      sm:gap-3
   
    "
  >
    <p className="text-[16px] font-medium text-[#3E4946] whitespace-nowrap">
      1 Ouguiya (MRU) équivaut à
    </p>

    {/* Container valeur */}
    <div
      className="
        flex
        items-center

        w-full
        h-[45px]

        sm:w-[270px]

        rounded-[15px]
        border
        border-[#7BC8C4]
        bg-white
        px-4
      "
    >
      <input
        type="text"
        inputMode="decimal"
        value={taux}
        onChange={handleTauxChange}
        className="
          flex-1
          min-w-0
          w-full
          bg-transparent
          text-[16px]
          text-[#4E9F8A]
          outline-none
        "
      />

      <span
        className="
          shrink-0
          text-[16px]
          font-medium
          text-[#4E9F8A]
          select-none
        "
      >
        EUR
      </span>
    </div>

    {/* Bouton */}
    <button
      type="button"
      onClick={handleUpdate}
     disabled={!tauxModifie || savingTaux || loadingTaux}
      className="
        w-full
        sm:w-auto
        sm:ml-auto

        h-[45px]
        px-4

        rounded-[15px]
        bg-[#4E9F8A]

        text-white
        text-[14px]
        font-semibold

        flex
        items-center
        justify-center
        gap-1.5

        hover:bg-[#428E7B]
        active:scale-[0.98]
        transition

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:active:scale-100
      "
    >
      {savingTaux ? "Mise à jour..." : "Mettre à jour"}
      <AiOutlineReload className={`text-[15px] ${savingTaux ? "animate-spin" : ""}`} />
      
    </button>
  </div>
  </div>

  {/* 12px entre les parties */}
  <div className="mt-3" />

  {erreurTaux && (
  <div className="mt-2 mb-2">
    <ErrorMessage message={erreurTaux} />
  </div>
   )}

  {/* --------------------------------
      PARTIE 3
  --------------------------------- */}
  <div
    className="
      flex
      items-center
      gap-2
      text-[#7A8582]
   
    "
  >
    <AiOutlineInfoCircle
      className="
        text-[15px]
        shrink-0
      "
    />

    <p className="text-[13px] leading-[1.4]">
      Utilisé pour toutes les conversions affichées (Zakat, bilans, rapports).
    </p>
  </div>
</div>

{/* =========================================
    RAPPEL DE VÉRIFICATION DU TAUX
========================================= */}
<div
  className="
    mt-4
    w-full
    rounded-[8px]
    border
    border-[#7BC8C4]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  <div
    className="
      flex
      flex-col
      items-start
      gap-4

      sm:flex-row
      sm:items-center
      sm:justify-between
    "
  >
    {/* GAUCHE — icône + texte */}
    <div className="flex items-center gap-4">
      {/* Icône cloche */}
      <div
        className="
          w-[48px]
          h-[48px]
          shrink-0
          rounded-full
          bg-[#FFF4DD]
          flex
          items-center
          justify-center
          text-[#F59E0B]
        "
      >
        <AiOutlineBell className="text-[28px]" />
      </div>

      {/* Texte */}
      <div>
        <h2
          className="
            text-[20px]
            font-semibold
            leading-tight
            text-[#4E9F8A]
          "
        >
          Rappel de vérification du taux
        </h2>

        <p
          className="
            mt-1
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Fréquence de notification système
        </p>
      </div>
    </div>

    {/* DROITE — SELECTEUR */}
    <div className="relative shrink-0 w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setRappelOuvert((prev) => !prev)}
        className="
          h-[40px]
          w-full
          sm:min-w-[150px]
          sm:w-auto
          px-3
          rounded-[10px]
          border
          border-[#7BC8C4]
          bg-white

          flex
          items-center
          justify-between
          gap-3

          text-[14px]
          text-[#3E4946]

          hover:bg-[#F7F9F8]
          transition
        "
      >
        <span>{frequenceRappel}</span>

        <AiOutlineDown
          className={`
            text-[16px]
            transition-transform
            ${rappelOuvert ? "rotate-180" : ""}
          `}
        />
      </button>

      <OptionsMenu
        open={rappelOuvert}
        onClose={() => setRappelOuvert(false)}
        options={optionsFrequence}
        onSelect={(value) => setFrequenceRappel(value)}
        position="top-[46px] left-0 sm:left-auto sm:right-0"
        width="w-full sm:w-[190px]"
      />
    </div>
  </div>
</div>

<h3 className="text-[20px] font-bold text-black mt-3">
  Villages
</h3>

{/* =========================================
    RÉGIONS / VILLAGES
========================================= */}
<div
  className="
    mt-4
    w-full
    rounded-[12px]
    border
    border-[#A7DAD8]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-4
  "
>
  {/* --------------------------------
      EN-TÊTE : icône + titre + "Voir la liste"
  --------------------------------- */}
  <div
    className="
      flex
      flex-col
      gap-2

      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:gap-4
    "
  >
    {/* Icon + titre */}
    <div className="flex items-center gap-3">
      <div
        className="
          w-[48px]
          h-[48px]
          shrink-0
          rounded-full
          bg-[#EAF7F3]
          flex
          items-center
          justify-center
          text-[#4E9F8A]
        "
      >
        <HiOutlineLocationMarker className="text-[28px]" />
      </div>

      <div>
        <h2
          className="
            text-[20px]
            font-semibold
            leading-tight
            text-[#4E9F8A]
          "
        >
          Les villages
        </h2>

        <p
          className="
            mt-0.5
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Les villages concerner par ce programme
        </p>
      </div>
    </div>

    {/* Voir la liste */}
    <button
      type="button"
      onClick={handleVoirToutesRegions}
      className="
        self-end
        sm:self-auto
        shrink-0

        flex
        items-center
        gap-1

        text-[15px]
        sm:text-[16px]
        font-semibold
        text-black

         hover:opacity-70
         active:scale-[0.97]
         transition
      "
    >
      Voir la liste des villages
      <img
        src={arrowUpRight}
        alt=""
        className="w-3.5 h-3.5"
      />
    </button>
  </div>

  {/* 16px avant le champ */}
  <div className="mt-4" />

  {/* --------------------------------
      CHAMP D'AJOUT — sur une seule ligne
  --------------------------------- */}
  <div
    className="
      flex
      flex-col
      items-start
      gap-3

      sm:flex-row
      sm:items-center
      sm:gap-3
    "
  >
    <div
      className="
        flex
        items-center

        w-full
        h-[45px]

        rounded-[15px]
        border
        border-[#4E9F8A]
        bg-white
        px-3
      "
    >
      <input
        type="text"
        value={nouvelleRegion}
        onChange={(e) => setNouvelleRegion(e.target.value)}
        placeholder="Ajouter le nom d'u nouveau village"
        className="
          flex-1
          min-w-0
          w-full
          bg-transparent
          text-[15px]
          text-[#3E4946]
          outline-none
          placeholder:text-[#9CA6A3]
        "
      />
    </div>

       <button
      type="button"
      onClick={handleAjouterRegion}
      disabled={!nouvelleRegion.trim() || ajoutRegionEnCours}
      className="
        w-full
        sm:w-auto
        sm:min-w-[110px]
        shrink-0

        h-[45px]
        px-10

        rounded-[15px]
        bg-[#7BC8C4]

        text-white
        text-[18px]
        font-semibold

        flex
        items-center
        justify-center

        hover:bg-[#6AB8B3]
        active:scale-[0.98]
        transition

        disabled:cursor-not-allowed
        disabled:active:scale-100
      "
    >
      {ajoutRegionEnCours ? "Ajout..." : "Ajouter"}
    </button>
  </div>

  {erreurRegions && (
    <div className="mt-2">
      <ErrorMessage message={erreurRegions} />
    </div>
  )}
</div>

<h3 className="text-[20px] font-bold text-black mt-3">
  Rapports
</h3>
{/* =========================================
    DESTINATAIRES DES RAPPORTS
========================================= */}
<div
  className="
    mt-4
    w-full
    rounded-[12px]
    border
    border-[#A7DAD8]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-4
  "
>
  {/* --------------------------------
      EN-TÊTE : icône + titre + "Voir la liste"
  --------------------------------- */}
  <div
    className="
      flex
      flex-col
      gap-2

      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:gap-4
    "
  >
    {/* Icon + titre */}
    <div className="flex items-center gap-3">
      <div
        className="
          w-[48px]
          h-[48px]
          shrink-0
          rounded-full
          bg-[#EAF7F3]
          flex
          items-center
          justify-center
          text-[#4E9F8A]
        "
      >
        <HiOutlineMail className="text-[28px]" />
      </div>

      <div>
        <h2
          className="
            text-[20px]
            font-semibold
            leading-tight
            text-[#4E9F8A]
          "
        >
          Emails destinataires des rapports
        </h2>

        <p
          className="
            mt-0.5
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Les adresses email qui recevront les rapports mensuels et annuels.
        </p>
      </div>
    </div>

    {/* Voir la liste */}
    <button
      type="button"
      onClick={handleVoirTousLesEmails}
      className="
        self-end
        sm:self-auto
        shrink-0

        flex
        items-center
        gap-1

        text-[15px]
        sm:text-[16px]
        font-semibold
        text-black

         hover:opacity-70
         active:scale-[0.97]
         transition
      "
    >
      Voir la liste des emails
      <img
        src={arrowUpRight}
        alt=""
        className="w-3.5 h-3.5"
      />
    </button>
  </div>

  {/* 16px avant le champ */}
  <div className="mt-4" />

  {/* --------------------------------
      CHAMP D'AJOUT — sur une seule ligne
  --------------------------------- */}
<div
  className="
    flex
    flex-col
    items-start
    gap-3

    sm:flex-row
    sm:items-center
    sm:gap-3
  "
>
  <div
    className="
      flex
      items-center
      w-full
      h-[45px]
      rounded-[15px]
      border
      bg-white
      px-3
    "
    style={{ borderColor: erreurEmail ? "#EF4444" : "#4E9F8A" }}
  >
    <input
      type="email"
      value={nouvelEmail}
      onChange={(e) => {
        setNouvelEmail(e.target.value);
        if (erreurEmail) setErreurEmail("");
      }}
      placeholder="Ajouter un nouveau destinataire, ex: responsable@organisation.com"
      className="
        flex-1
        min-w-0
        w-full
        bg-transparent
        text-[15px]
        text-[#3E4946]
        outline-none
        placeholder:text-[#9CA6A3]
      "
    />
  </div>

  {/* Sélecteur type de rapport */}
  <div className="relative shrink-0 w-full sm:w-auto">
    <button
      type="button"
      onClick={() => setDropdownTypeOuvert((prev) => !prev)}
      className="
        h-[45px]
        w-full
        sm:min-w-[160px]
        sm:w-auto
        px-3
        rounded-[15px]
        border
        border-[#7BC8C4]
        bg-white

        flex
        items-center
        justify-between
        gap-3

        text-[14px]
        text-[#3E4946]

        hover:bg-[#F7F9F8]
        transition
      "
    >
      <span>
        {optionsTypeRapport.find((o) => o.value === typeRapportSelectionne)?.label}
      </span>

      <AiOutlineDown
        className={`
          text-[16px]
          transition-transform
          ${dropdownTypeOuvert ? "rotate-180" : ""}
        `}
      />
    </button>

    <OptionsMenu
      open={dropdownTypeOuvert}
      onClose={() => setDropdownTypeOuvert(false)}
      options={optionsTypeRapport.map((o) => o.label)}
      onSelect={(label) => {
        const found = optionsTypeRapport.find((o) => o.label === label);
        if (found) setTypeRapportSelectionne(found.value);
      }}
      position="top-[50px] left-0 sm:left-auto sm:right-0"
      width="w-full sm:w-[190px]"
    />
  </div>

  <button
    type="button"
    onClick={handleAjouterEmail}
    disabled={!nouvelEmail.trim() || ajoutEmailEnCours}
    className="
      w-full
      sm:w-auto
      sm:min-w-[110px]
      shrink-0

      h-[45px]
      px-10

      rounded-[15px]
      bg-[#7BC8C4]

      text-white
      text-[18px]
      font-semibold

      flex
      items-center
      justify-center

      hover:bg-[#6AB8B3]
      active:scale-[0.98]
      transition

      disabled:cursor-not-allowed
      disabled:active:scale-100
    "
  >
    {ajoutEmailEnCours ? "Ajout..." : "Ajouter"}
  </button>
</div>

{erreurChargementEmails && (
  <div className="mt-2">
    <ErrorMessage message={erreurChargementEmails} />
  </div>
)}

{erreurEmail && (
  <div className="mt-2">
    <ErrorMessage message={erreurEmail} />
  </div>
)}
</div>


<h3 className="text-[20px] font-bold text-black mt-3">
  Notifications
</h3>

{/* =========================================
    SONNERIE DES NOTIFICATIONS
========================================= */}
<div
  className="
    mt-3
    w-full
    rounded-[8px]
    border
    border-[#7BC8C4]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  <div
    className="
      flex
      flex-col
      items-start
      gap-4

      sm:flex-row
      sm:items-center
      sm:justify-between
    "
  >
    {/* GAUCHE — icône + texte */}
    <div className="flex items-center gap-4">
      {/* Icône cloche */}
      <div
        className="
          w-[48px]
          h-[48px]
          shrink-0
          rounded-full
          bg-[#EAF7F3]
          flex
          items-center
          justify-center
          text-[#4E9F8A]
        "
      >
        <AiOutlineBell className="text-[28px]" />
      </div>

      {/* Texte */}
      <div>
        <h2
          className="
            text-[20px]
            font-semibold
            leading-tight
            text-[#4E9F8A]
          "
        >
          Sonnerie des notifications
        </h2>

        <p
          className="
            mt-1
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Vous pouvez choisir la sonnerie qui vous convient
        </p>
      </div>
    </div>

    {/* DROITE — BOUTON */}
    <button
      type="button"
      onClick={handleSelectionnerSonnerie}
      className="
        h-[45px]
        w-full
        sm:w-auto
        px-6

        rounded-[15px]
        bg-[#7BC8C4]

        text-white
        text-[16px]
        font-semibold

        flex
        items-center
        justify-center

        hover:bg-[#6AB8B3]
        active:scale-[0.98]
        transition
        shrink-0
      "
    >
      Sélectionner une sonnerie
    </button>
  </div>
</div>

{/* =========================================
    GESTION DES NOTIFICATIONS
========================================= */}
<div
  className="
    mt-3
    w-full
    rounded-[12px]
    border
    border-[#A7DAD8]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  {/* En-tête */}
  <div className="flex items-start gap-4">
    <div
      className="
        w-[48px]
        h-[48px]
        shrink-0
        rounded-full
        bg-[#EAF7F3]
        flex
        items-center
        justify-center
        text-[#4E9F8A]
      "
    >
      <AiOutlineBell className="text-[28px]" />
    </div>

    <div>
      <h2 className="text-[20px] font-semibold leading-tight text-[#4E9F8A]">
        Gestion des notifications
      </h2>
      <p className="mt-1 text-[15px] leading-tight text-[#3E4946]">
        Il est préférable de garder les notifications activées afin de pouvoir consulter toutes les mises à jour.
      </p>
    </div>
  </div>

  {/* Ligne séparatrice */}
  <div className="mt-4 border-t border-[#E5EAE8]" />

  {/* Liste des options */}
  <div className="flex flex-col">
    <div className="flex items-center justify-between py-4 border-b border-[#E5EAE8]">
      <p className="text-[16px] font-semibold text-[#000000]">Les visites en retard</p>
      <ToggleSwitch checked={notifVisitesRetard} onChange={setNotifVisitesRetard} />
    </div>

    <div className="flex items-center justify-between py-4 border-b border-[#E5EAE8]">
      <p className="text-[16px] font-semibold text-[#000000]">Les alertes MAS de nourrison</p>
      <ToggleSwitch checked={notifAlertesMAS} onChange={setNotifAlertesMAS} />
    </div>

    <div className="flex items-center justify-between py-4 border-b border-[#E5EAE8]">
      <p className="text-[16px] font-semibold text-[#000000]">Les alertes de bas stocks</p>
      <ToggleSwitch checked={notifAlertesStocks} onChange={setNotifAlertesStocks} />
    </div>

    <div className="flex items-center justify-between py-4 border-b border-[#E5EAE8]">
      <p className="text-[16px] font-semibold text-[#000000]">Les rappels de validation du rapport mensuel</p>
      <ToggleSwitch checked={notifRapportMensuel} onChange={setNotifRapportMensuel} />
    </div>

    <div className="flex items-center justify-between py-4 border-b border-[#E5EAE8]">
      <p className="text-[16px] font-semibold text-[#000000]">Les rappels de validation du bilan donateurs</p>
      <ToggleSwitch checked={notifBilanDonateurs} onChange={setNotifBilanDonateurs} />
    </div>

    <div className="flex items-center justify-between py-4">
      <p className="text-[16px] font-semibold text-[#000000]">Les rappels de validation du rapport annuel</p>
      <ToggleSwitch checked={notifRapportAnnuel} onChange={setNotifRapportAnnuel} />
    </div>
  </div>
</div>


 <div className="mt-2 pb-0 w-full">
  <Button
    title="Enregistrer les paramètres"
    variant="save"
    onClick={handleSave}
    fullWidth={true}
    noWrapperPadding
  />
   </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-[15px]
          bg-white
          z-20
        "
      />
    </main>

 <VillageListDialog
  open={showRegionsList}
  title="Les villages"
  items={regions}
  onUpdate={handleModifierRegion}
  onDelete={handleSupprimerRegion}
  onClose={() => {
    setShowRegionsList(false);
    setErreurSuppressionRegion("");
  }}
  loading={loadingRegions}
  errorMessage={erreurSuppressionRegion}
  emptyMessage="Aucun village pour l'instant."
/>
<ListManagerDialog
  open={showEmailsList}
  title="Emails destinataires des rapports annuels et mensuels"
  items={emailsAffiches}
  onDelete={handleSupprimerEmail}
  onClose={() => setShowEmailsList(false)}
  loading={loadingEmails}
  errorMessage={erreurSuppressionEmail}
  emptyMessage={
    filtreTypeEmail === "les_deux"
      ? "Aucun email n'est abonné aux deux types de rapport."
      : "Aucun destinataire pour l'instant."
  }
  filters={EMAIL_TYPE_FILTERS}
  filterValue={filtreTypeEmail}
  onFilterChange={setFiltreTypeEmail}
/>
  </div>
);
}
