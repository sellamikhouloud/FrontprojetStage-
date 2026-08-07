import { useState } from "react";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import omsInfo from "../assets/oms-info.svg";
import arrowUpRight from "../assets/Arrow up-right.svg";
import {
  AiOutlineInfoCircle,
  AiOutlineReload,
  AiOutlineBell,
  AiOutlineDown,
  AiOutlineLineChart,
  AiOutlineExport
} from "react-icons/ai";

import { HiOutlineCurrencyEuro, HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import OptionsMenu from "../components/Containers/OptionsMenu";
import Button from "../components/Button/Button";
import ErrorMessage from "../components/Forms/ErrorMessage";
import ListManagerDialog from "../components/Popups/ListManagerDialog";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../components/Button/ToggleSwitch";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Parametres({ onClose }) {
 const navigate = useNavigate();

const [taux, setTaux] = useState("0.022");
const [tauxInitial, setTauxInitial] = useState("0.022");

  const [rappelOuvert, setRappelOuvert] = useState(false);

  const [frequenceRappel, setFrequenceRappel] =
    useState("Tous les mois");

  const optionsFrequence = [
    "Tous les mois",
    "Tous les 2 mois",
    "Tous les 3 mois",
    "Désactivé",
  ];
  const [scoreMAMMin, setScoreMAMMin] = useState("-3");
  const [scoreMAMMax, setScoreMAMMax] = useState("-2");

  const [scoreMAS, setScoreMAS] = useState("-3");

  const [muacMAM, setMuacMAM] = useState("115");
  const [muacMAS, setMuacMAS] = useState("110");

  const [notifVisitesRetard, setNotifVisitesRetard] = useState(false);
const [notifAlertesMAS, setNotifAlertesMAS] = useState(true);
const [notifAlertesStocks, setNotifAlertesStocks] = useState(true);
const [notifRapportMensuel, setNotifRapportMensuel] = useState(true);
const [notifBilanDonateurs, setNotifBilanDonateurs] = useState(true);
const [notifRapportAnnuel, setNotifRapportAnnuel] = useState(true);

  // Ajout de région
  const [nouvelleRegion, setNouvelleRegion] = useState("");
  // Liste des régions — à remplacer par les données réelles de l'API
  const [regions, setRegions] = useState([
    { id: 1, label: "Nouakchott" ,date: "04/08/2026"},
    { id: 2, label: "Nouadhibou" ,date: "04/08/2026"},
    { id: 3, label: "Rosso" , date: "04/08/2026"},
    { id: 4, label: "Rosso" , date: "04/08/2026"},
     { id: 5, label: "Rosso" , date: "04/08/2026"},
  ]);
  const [showRegionsList, setShowRegionsList] = useState(false);

  // Ajout d'email destinataire des rapports
  const [nouvelEmail, setNouvelEmail] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");
  // Liste des destinataires — à remplacer par les données réelles de l'API
  const [emails, setEmails] = useState([
    { id: 1, label: "direction@nutrigest.mr" , date: "04/08/2026" },
    { id: 2, label: "comptabilite@nutrigest.mr" , date: "04/08/2026" },
    { id: 3, label: "comptabilite@nutrigest.mr" , date: "04/08/2026" },
    { id: 4, label: "comptabilite@nutrigest.mr" , date: "04/08/2026" },
    { id: 5, label: "comptabilite@nutrigest.mr" , date: "04/08/2026" },
    { id: 6, label: "comptabilite@nutrigest.mr" , date: "04/08/2026" },
        
  ]);
  const [showEmailsList, setShowEmailsList] = useState(false);

  const handleTauxChange = (e) => {
    const value = e.target.value;


    // Autorise uniquement les nombres avec décimales
    if (/^\d*\.?\d*$/.test(value)) {
      setTaux(value);
    }
  };

  const tauxModifie = taux.trim() !== "" && taux !== tauxInitial;

  const handleUpdate = () => {
    if (!tauxModifie) return;

    console.log("Nouveau taux :", taux);

    // Ici tu mets ta logique de sauvegarde
    // updateTauxChange(taux);
    setTauxInitial(taux);
  };

  const handleAjouterRegion = () => {
    const nom = nouvelleRegion.trim();
    if (!nom) return;

    console.log("Nouvelle région à ajouter :", nom);

    // TODO: appel API pour créer la région, puis remplacer par la réponse réelle
    setRegions((prev) => [...prev, { id: Date.now(), label: nom }]);

    setNouvelleRegion("");
  };

  const handleSupprimerRegion = (id) => {
    console.log("Région à supprimer :", id);

    // TODO: appel API pour supprimer la région côté serveur
    setRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleVoirToutesRegions = () => {
    setShowRegionsList(true);
  };

  const handleAjouterEmail = () => {
    const email = nouvelEmail.trim();
    if (!email) return;

    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValide) {
      setErreurEmail("Cette adresse email n'est pas valide.");
      return;
    }

    setErreurEmail("");
    console.log("Nouvel email destinataire des rapports :", email);

    // TODO: appel API pour enregistrer l'email, puis remplacer par la réponse réelle
    setEmails((prev) => [...prev, { id: Date.now(), label: email }]);

    setNouvelEmail("");
  };

  const handleSupprimerEmail = (id) => {
    console.log("Destinataire à supprimer :", id);

    // TODO: appel API pour supprimer le destinataire côté serveur
    setEmails((prev) => prev.filter((e) => e.id !== id));
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
          text-[24px]
          sm:text-[26px]
          font-semibold
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
        12 juin 2026
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
      disabled={!tauxModifie}
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
      Mettre à jour
      <AiOutlineReload className="text-[15px]" />
    </button>
  </div>
  </div>

  {/* 12px entre les parties */}
  <div className="mt-3" />

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
      disabled={!nouvelleRegion.trim()}
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
      Ajouter
    </button>
  </div>
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

    <button
      type="button"
      onClick={handleAjouterEmail}
      disabled={!nouvelEmail.trim()}
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
      Ajouter
    </button>
  </div>

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

    <ListManagerDialog
      open={showRegionsList}
      title="Toutes les régions"
      items={regions}
      onDelete={handleSupprimerRegion}
      onClose={() => setShowRegionsList(false)}
      emptyMessage="Aucune région pour l'instant."
    />

    <ListManagerDialog
      open={showEmailsList}
      title="Emails destinataires des rapports annuels et mensuels"
      items={emails}
      onDelete={handleSupprimerEmail}
      onClose={() => setShowEmailsList(false)}
      emptyMessage="Aucun destinataire pour l'instant."
    />
  </div>
);
}
