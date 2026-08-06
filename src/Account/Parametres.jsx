import { useState } from "react";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import omsInfo from "../assets/oms-info.svg";
import {
  AiOutlineInfoCircle,
  AiOutlineReload,
  AiOutlineBell,
  AiOutlineDown,
  AiOutlineLineChart,
} from "react-icons/ai";
import { HiOutlineCurrencyEuro, HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import OptionsMenu from "../components/Containers/OptionsMenu";
import Button from "../components/Button/Button";
import ErrorMessage from "../components/Forms/ErrorMessage";
import ListManagerDialog from "../components/Popups/ListManagerDialog";
import { useNavigate } from "react-router-dom";

export default function Parametres({ onClose }) {
  const navigate = useNavigate();
  const [taux, setTaux] = useState("0.022");
  const [tauxInitial] = useState("0.022");
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

  // Ajout de région
  const [nouvelleRegion, setNouvelleRegion] = useState("");
  // Liste des régions — à remplacer par les données réelles de l'API
  const [regions, setRegions] = useState([
    { id: 1, label: "Nouakchott" },
    { id: 2, label: "Nouadhibou" },
    { id: 3, label: "Rosso" },
  ]);
  const [showRegionsList, setShowRegionsList] = useState(false);

  // Ajout d'email destinataire des rapports
  const [nouvelEmail, setNouvelEmail] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");
  // Liste des destinataires — à remplacer par les données réelles de l'API
  const [emails, setEmails] = useState([
    { id: 1, label: "direction@nutrigest.mr" },
    { id: 2, label: "comptabilite@nutrigest.mr" },
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
  });

  // Ici ta logique de sauvegarde
};

  return (
    <>
    <div className="
      min-h-screen
      bg-white
      px-6
      sm:px-10
      lg:px-20
      pt-8
      pb-6
      sm:pb-0
      sm:pt-5
    ">
      
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

      {/* ================================
    TAUX DE CHANGE
================================= */}
<div
  className="
    mt-2
    w-full
    rounded-[12px]
    border
    border-[#7BC8C4]
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
    <div className="flex items-center gap-4">

      {/* Cercle */}
      <div
        className="
          w-[50px]
          h-[50px]
          shrink-0
          rounded-full
          bg-[#EAF7F3]
          flex
          items-center
          justify-center
          text-[#4E9F8A]
        "
      >
        <HiOutlineCurrencyEuro className="text-[32px]" />
      </div>

      {/* Titre */}
   <div
  className="
    flex
    items-center
    gap-3

    sm:block
  "
>
  <h2
    className="
      text-[20px]
      font-semibold
      leading-tight
      text-[#346A5C]
    "
  >
    Taux de change
  </h2>

  <p
    className="
      text-[18px]
      leading-tight
      text-[#3E4946]
      whitespace-nowrap

      sm:mt-1
    "
  >
    EUR/MRU
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
      <p className="text-[14px] sm:text-[16px] text-[#3E4946]">
        Dernière mise à jour
      </p>

      <p className="text-[14px] sm:text-[16px] text-[#3E4946]">
        12 juin 2026
      </p>
    </div>
  </div>

  {/* 16px entre les parties */}
  <div className="mt-4" />

  {/* --------------------------------
      PARTIE 2
  --------------------------------- */}
  <div
    className="
      w-full
      rounded-[10px]
      bg-[#F7F9F8]

      px-4
      py-4

      sm:px-4
      sm:py-3
    "
  >
    <p
      className="
        text-[16px]
        text-[#3E4946]
      "
    >
      1 Ouguiya (MRU) équivaut à
    </p>

    <div
      className="
        mt-3
        flex
        flex-col
        items-start
        gap-3

        sm:flex-row
        sm:items-center
        sm:gap-3
      "
    >
      {/* Container valeur */}
      <div
        className="
          flex
          items-center

          w-full
          h-[40px]

          sm:w-[270px]

          rounded-[10px]
          border
          border-[#7BC8C4]
          bg-white
          px-2
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
            text-[18px]
            text-[#346A5C]
            outline-none
          "
        />

        <span
          className="
            shrink-0
            text-[18px]
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

          h-[40px]
          px-4

          rounded-full
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

          sm:ml-auto
        "
      >
        <AiOutlineReload className="text-[16px]" />
        Mettre à jour
      </button>
    </div>
  </div>

  {/* 16px entre les parties */}
  <div className="mt-4" />

  {/* --------------------------------
      PARTIE 3
  --------------------------------- */}
  <div
    className="
      flex
      items-start
      gap-2
      text-[#3E4946]
    "
  >
    <AiOutlineInfoCircle
      className="
        text-[18px]
        shrink-0
        mt-[1px]
      "
    />

    <p className="text-[14px] leading-[1.4]">
      Utilisé pour toutes les conversions affichées
      (Zakat, bilans, rapports).
    </p>
  </div>
</div>

{/* =========================================
    RÉGIONS
========================================= */}
<div
  className="
    mt-4
    w-full
    rounded-[12px]
    border
    border-[#7BC8C4]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  {/* --------------------------------
      EN-TÊTE : icône + titre + "Voir tout"
  --------------------------------- */}
  <div
    className="
      flex
      items-start
      justify-between
      gap-3

      sm:items-center
      sm:gap-4
    "
  >
    {/* Icon + titre */}
    <div className="flex items-center gap-4">
      <div
        className="
          w-[50px]
          h-[50px]
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
            text-[#346A5C]
          "
        >
          Régions
        </h2>

        <p
          className="
            mt-1
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Gérer les régions disponibles
        </p>
      </div>
    </div>

    {/* Voir tout */}
    <button
      type="button"
      onClick={handleVoirToutesRegions}
      className="
        shrink-0

        text-[15px]
        font-semibold
        text-[#4E9F8A]

        hover:text-[#346A5C]
        transition
        underline
        underline-offset-2
      "
    >
      Voir tout
    </button>
  </div>

  {/* 16px avant le champ */}
  <div className="mt-4" />

  {/* --------------------------------
      CHAMP D'AJOUT
  --------------------------------- */}
  <div
    className="
      w-full
      rounded-[10px]
      bg-[#F7F9F8]

      px-4
      py-4

      sm:px-4
      sm:py-3
    "
  >
    <p className="text-[16px] text-[#3E4946]">
      Ajouter une nouvelle région
    </p>

    <div
      className="
        mt-3
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
          h-[40px]

          sm:w-[270px]

          rounded-[10px]
          border
          border-[#7BC8C4]
          bg-white
          px-3
        "
      >
        <input
          type="text"
          value={nouvelleRegion}
          onChange={(e) => setNouvelleRegion(e.target.value)}
          placeholder="Nom de la région"
          className="
            flex-1
            min-w-0
            w-full
            bg-transparent
            text-[18px]
            text-[#346A5C]
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
          sm:min-w-[140px]

          h-[40px]
          px-4

          rounded-full
          bg-[#4E9F8A]

          text-white
          text-[14px]
          font-semibold

          flex
          items-center
          justify-center

          hover:bg-[#428E7B]
          active:scale-[0.98]
          transition

          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:active:scale-100

          sm:ml-auto
        "
      >
        Ajouter
      </button>
    </div>
  </div>
</div>

{/* =========================================
    DESTINATAIRES DES RAPPORTS
========================================= */}
<div
  className="
    mt-4
    w-full
    rounded-[12px]
    border
    border-[#7BC8C4]
    bg-white

    px-5
    py-4

    sm:px-6
    sm:py-[15px]
  "
>
  {/* --------------------------------
      EN-TÊTE : icône + titre + "Voir tout"
  --------------------------------- */}
  <div
    className="
      flex
      items-start
      justify-between
      gap-3

      sm:items-center
      sm:gap-4
    "
  >
    {/* Icon + titre */}
    <div className="flex items-center gap-4">
      <div
        className="
          w-[50px]
          h-[50px]
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
            text-[#346A5C]
          "
        >
          Destinataires des rapports
        </h2>

        <p
          className="
            mt-1
            text-[16px]
            leading-tight
            text-[#3E4946]
          "
        >
          Rapports mensuels et annuels envoyés par email
        </p>
      </div>
    </div>

    {/* Voir tout */}
    <button
      type="button"
      onClick={handleVoirTousLesEmails}
      className="
        shrink-0

        text-[15px]
        font-semibold
        text-[#4E9F8A]

        hover:text-[#346A5C]
        transition
        underline
        underline-offset-2
      "
    >
      Voir tout
    </button>
  </div>

  {/* 16px avant le champ */}
  <div className="mt-4" />

  {/* --------------------------------
      CHAMP D'AJOUT
  --------------------------------- */}
  <div
    className="
      w-full
      rounded-[10px]
      bg-[#F7F9F8]

      px-4
      py-4

      sm:px-4
      sm:py-3
    "
  >
    <p className="text-[16px] text-[#3E4946]">
      Ajouter un destinataire
    </p>

    <div
      className="
        mt-3
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
          h-[40px]

          sm:w-[270px]

          rounded-[10px]
          border
          bg-white
          px-3
        "
        style={{ borderColor: erreurEmail ? "#EF4444" : "#7BC8C4" }}
      >
        <input
          type="email"
          value={nouvelEmail}
          onChange={(e) => {
            setNouvelEmail(e.target.value);
            if (erreurEmail) setErreurEmail("");
          }}
          placeholder="exemple@email.com"
          className="
            flex-1
            min-w-0
            w-full
            bg-transparent
            text-[18px]
            text-[#346A5C]
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
          sm:min-w-[140px]

          h-[40px]
          px-4

          rounded-full
          bg-[#4E9F8A]

          text-white
          text-[14px]
          font-semibold

          flex
          items-center
          justify-center

          hover:bg-[#428E7B]
          active:scale-[0.98]
          transition

          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:active:scale-100

          sm:ml-auto
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
{/* =====================================
    MOBILE
====================================== */}
<div className="sm:hidden">

{/* Icon + titre */}
<div className="flex items-center gap-4">

  {/* Icône cloche */}
  <div
    className="
      w-[50px]
      h-[50px]
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

  {/* Titre uniquement */}
  <div>
    <h2
      className="
        text-[20px]
        font-semibold
        leading-tight
        text-[#346A5C]
      "
    >
      Rappel de vérification du taux
    </h2>
  </div>
</div>

{/* Sous-titre BELOW icon + titre */}
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

{/* Selecteur */}
<div className="relative mt-4 flex justify-center">

  <button
    type="button"
    onClick={() =>
      setRappelOuvert((prev) => !prev)
    }
    className="
      h-[50px]
      w-[220px]
      px-4
      rounded-[16px]
      border
      border-[#7BC8C4]
      bg-white

      flex
      items-center
      justify-between

      text-[18px]
      text-[#3E4946]

      hover:bg-[#F7F9F8]
      transition
    "
  >
    <span>
      {frequenceRappel}
    </span>

    <AiOutlineDown
      className={`
        text-[20px]
        transition-transform
        ${rappelOuvert ? "rotate-180" : ""}
      `}
    />
  </button>

  <OptionsMenu
    open={rappelOuvert}
    onClose={() => setRappelOuvert(false)}
    options={optionsFrequence}
    onSelect={(value) => {
      setFrequenceRappel(value);
    }}
    position="top-[56px] left-1/2 -translate-x-1/2"
    width="w-[220px]"
  />
</div>
</div>

  {/* =====================================
      DESKTOP
  ====================================== */}
  <div
    className="
      hidden
      sm:flex
      items-center
      justify-between
      gap-4
    "
  >

    {/* GAUCHE */}
    <div className="flex items-center gap-4">

      {/* Icône cloche */}
      <div
        className="
          w-[50px]
          h-[50px]
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
            text-[#346A5C]
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
    <div className="relative shrink-0">

      <button
        type="button"
        onClick={() =>
          setRappelOuvert((prev) => !prev)
        }
        className="
          h-[40px]
          min-w-[150px]
          px-3
          rounded-[10px]
          border
          border-[#B8DDD5]
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
          {frequenceRappel}
        </span>

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
        onSelect={(value) => {
          setFrequenceRappel(value);
        }}
        position="top-[46px] right-0"
        width="w-[190px]"
      />
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
      title="Tous les destinataires"
      items={emails}
      onDelete={handleSupprimerEmail}
      onClose={() => setShowEmailsList(false)}
      emptyMessage="Aucun destinataire pour l'instant."
    />
    </>
  );
}