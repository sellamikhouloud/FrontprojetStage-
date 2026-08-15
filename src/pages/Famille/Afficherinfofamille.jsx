import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFamille } from "@/lib/api/familles";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import InfoCard from "../../components/Containers/AfficherContainer";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatusBadge from "../../components/Cards/Badge";
import PopupDistributionfamille from "../../components/Popups/PopupDistributionfamille";
import Button from "../../components/Button/Button";
import Popupvisites from "../../components/Popups/Popupvisitefamille"
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


const FamilyProfile = () => {
  const location = useLocation();
    const navigate = useNavigate();
const { id } = useParams();


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
} = useQuery({
  queryKey: ["famille", id],
  queryFn: () => getFamille(id).then((res) => res.data),
  enabled: !!id,
});

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


const isMobile = window.innerWidth < 768;


  const nourrisson = [
  {
   label: "Date de naissance",
  value: famille?.nourrisson?.date_naissance
    ? famille.nourrisson.date_naissance.split("-").reverse().join("/")
    : "/",
  },
  {
    label: "Sexe",
  value:
    famille?.nourrisson?.sexe === "M" ||
    famille?.nourrisson?.sexe === "Masculin"
      ? "Masculin"
      : famille?.nourrisson?.sexe === "F" ||
        famille?.nourrisson?.sexe === "Féminin"
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
    value: famille?.mere?.statut_matrimonial || "/",
  },
  {
    label: "Nombre d'enfants à charge",
    value: famille?.mere?.nb_enfants ?? "/",
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
    label: "Enregistré par",
    value: famille?.audit?.cree_par
      ? `${famille.audit.cree_par.prenom} ${famille.audit.cree_par.nom}`
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
      ? `${famille.audit.modifie_par.prenom} ${famille.audit.modifie_par.nom}`
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
  Active: {
    text: "Active",
    type: "mereActive",
  },
  sortie: {
    text: "Sortie",
    type: "sortie",
  },
  Sortie: {
    text: "Sortie",
    type: "sortie",
  },
};
const statut =
  STATUT_FAMILLE[famille?.statut] || null;

const STATUT_BEBE = {
  normale: {
    text: "Bébé normal",
    type: "mereNormal",
  },
  "Normale": {
    text: "Bébé normal",
    type: "mereNormal",
  },
  mam: {
    text: "MAM nourrisson",
    type: "mam",
  },
  "Malnutrition Aiguë Modérée": {
    text: "MAM nourrisson",
    type: "mam",
  },
  mas: {
    text: "MAS nourrisson",
    type: "mas",
  },
  "Malnutrition Aiguë Sévère": {
    text: "MAS nourrisson",
    type: "mas",
  },
};

const STATUT_MERE = {
  normale: {
    text: "Mère normale",
    type: "mereNormal",
  },
  "Normale": {
    text: "Mère normale",
    type: "mereNormal",
  },
  a_risque: {
    text: "Mère à risque",
    type: "mereActive",
  },
  "À risque": {
    text: "Mère à risque",
    type: "mereActive",
  },
  malnutrition: {
    text: "Malnutrition",
    type: "mas",
  },
  Malnutrition: {
    text: "Malnutrition",
    type: "mas",
  },
};

const statutBebe =
  STATUT_BEBE[famille?.statut_nutritionnel_bebe] || null;

const statutMere =
  STATUT_MERE[famille?.statut_nutritionnel_mere] || null;

const zakatList = [
  {
    id: 1,
    numero: "Zakat n°1",
    date: "15/05/2026",
    montant: "500 ",
    euro: "12.45",

    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem Mint Ahmed",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "12 mars 2025",
    code: "GDK-2026-003",

    enregistrePar: "Coordinateur",
    modePaiement: "Bankily",
    observations: "Observation...",
    causePrincipale: "Cause principale",
    precisions: "Précisions...",
  },

  {
    id: 2,
    numero: "Zakat n°2",
    date: "20/06/2026",
    montant: "750 ",
    euro: "18.67",

    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem Mint Ahmed",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "12 mars 2025",
    code: "GDK-2026-003",

    enregistrePar: "Coordinateur",
    modePaiement: "Espèces",
    observations: "",
    causePrincipale: "",
    precisions: "",
  },
];
const distributionList = [
  {
    id: 1,

    // Informations de la carte
    distribution: "Distribution 1",
    date: "15/05/2026",
    produits: [
      { nom: "Lait infantile", quantite: "2 boîtes" },
      { nom: "Riz", quantite: "5 kg" },
      { nom: "Huile", quantite: "1 L" },
    ],

    // Informations générales
    numeroDistribution: 1,
    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem Mint Ahmed",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "12 mars 2025",
    code: "GDK-2026-003",

    enregistrePar: "Coordinateur",

    // Lait infantile
    typeLait: "2ème âge (6–12 mois)",
    nombreBoites: "2 boîtes",
    poidsTotal: "1600 g",

    // Colis alimentaire (dynamique)
    colisAlimentaire: [
      {
        label: "Riz",
        value: "5 kg",
      },
      {
        label: "Huile",
        value: "1 L",
      },
      {
        label: "Sucre",
        value: "2 kg",
      },
      {
        label: "Farine",
        value: "3 kg",
      },
    ],
  },

  {
    id: 2,

    distribution: "Distribution 2",
    date: "20/05/2026",
    produits: [
      { nom: "Lait infantile", quantite: "3 boîtes" },
      { nom: "Farine", quantite: "4 kg" },
    ],

    numeroDistribution: 2,
    enfant: "Mohamed Ould Ahmed",
    mere: "Khadijetou Mint Mohamed",
    sexe: "Fils",
    region: "Nouakchott",
    dateNaissance: "05 janvier 2025",
    code: "GDK-2026-004",

    enregistrePar: "Administrateur",

    typeLait: "1er âge (0–6 mois)",
    nombreBoites: "3 boîtes",
    poidsTotal: "2400 g",

  
  },

  {
    id: 3,

    distribution: "Distribution 3",
    date: "28/05/2026",
    produits: [
      { nom: "Lait infantile", quantite: "1 boîte" },
      { nom: "Lentilles", quantite: "2 kg" },
      { nom: "Riz", quantite: "3 kg" },
    ],

    numeroDistribution: 3,
    enfant: "Fatimata Mint Sidi",
    mere: "Aminetou Mint Ely",
    sexe: "Fille",
    region: "Rosso",
    dateNaissance: "18 février 2025",
    code: "GDK-2026-005",

    enregistrePar: "Coordinateur",

    typeLait: "3ème âge (12 mois et plus)",
    nombreBoites: "1 boîte",
    poidsTotal: "800 g",

   
  },
];
const visiteList = [
  {
    id: 1,
    numeroVisite: 1,
    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "15/05/2026",
    code: "GDK-2026-003",
    date: "15/05/2026",
    enregistrePar: "Coordinateur",

    nourrisson: {
      poids: 500,
      taille: 35,
      muac: 112,
    },

    mereMesure: {
      poids: 55,
      taille: "-",
      muac: 240,
    },

    zScores: {
      pa: -0.8,
      ta: -2.4,
      pt: -3.5,
    },

    statuts: [
      { type: "mam", text: "MAS nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],

    observationNourrisson: "Observation nourrisson",
    observationMere: "Observation mère",
    evaluationFamiliale: "Famille stable",

    visite: "Visite 1",
    poids: "500",
    taille: "35",
    badges: [
      { type: "mam", text: "MAS nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },

  {
    id: 2,
    numeroVisite: 2,
    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "15/05/2026",
    code: "GDK-2026-003",
    date: "20/05/2026",
    enregistrePar: "Coordinateur",

    nourrisson: {
      poids: 520,
      taille: 36,
      muac: 114,
    },

    mereMesure: {
      poids: 56,
      taille: "-",
      muac: 242,
    },

    zScores: {
      pa: 1.3,
      ta: -1.5,
      pt: 2.6,
    },

    statuts: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],

    observationNourrisson: "Évolution satisfaisante.",
    observationMere: "RAS",
    evaluationFamiliale: "Bonne implication de la famille.",

    visite: "Visite 2",
    poids: "520",
    taille: "36",
    badges: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },

  {
    id: 3,
    numeroVisite: 3,
    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem",
    sexe: "Fille",
    region: "Lexeiba",
    dateNaissance: "15/05/2026",
    code: "GDK-2026-003",
    date: "30/05/2026",
    enregistrePar: "Coordinateur",

    nourrisson: {
      poids: 540,
      taille: 37,
      muac: 116,
    },

    mereMesure: {
      poids: 56,
      taille: "-",
      muac: 243,
    },

    zScores: {
      pa: -3.8,
      ta: 0.5,
      pt: -2.1,
    },

    statuts: [
      { type: "mam", text: "MAS nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],

    observationNourrisson: "Surveillance renforcée.",
    observationMere: "Bon état général.",
    evaluationFamiliale: "Suivi régulier.",

    visite: "Visite 3",
    poids: "540",
    taille: "37",
    badges: [
      { type: "mam", text: "MAS nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },

  {
    id: 4,
    numeroVisite: 4,
    enfant: "Mohamed Ould Ahmed",
    mere: "Fatimata",
    sexe: "Garçon",
    region: "Rosso",
    dateNaissance: "20/04/2026",
    code: "GDK-2026-004",
    date: "20/06/2026",
    enregistrePar: "Agent de santé",

    nourrisson: {
      poids: 610,
      taille: 38,
      muac: 118,
    },

    mereMesure: {
      poids: 58,
      taille: 162,
      muac: 250,
    },

    zScores: {
      pa: 0.2,
      ta: 2.3,
      pt: -0.6,
    },

    statuts: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],

    observationNourrisson:
      "Bonne prise de poids depuis la dernière visite.",
    observationMere:
      "État nutritionnel satisfaisant.",
    evaluationFamiliale:
      "Famille coopérative.",

    visite: "Visite 4",
    poids: "610",
    taille: "38",
    badges: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },
];

const DONNEES_POIDS = [
  { age: 0, poids: 3.1 },
  { age: 1, poids: 3.6 },
  { age: 2, poids: 4.2 },
  { age: 3, poids: 4.8 },
  { age: 4, poids: 5.4 },
  { age: 5, poids: 6.0 },
  { age: 6, poids: 6.6 },
  { age: 7, poids: 7.3 },
  { age: 8, poids: 8.0 },
  { age: 9, poids: 8.7 },
  { age: 10, poids: 9.4 },
  { age: 11, poids: 10.1 },
];

// Données de test — Taille pour l'âge
const DONNEES_TAILLE = [
  { age: 0, taille: 57.5 },
  { age: 1, taille: 60.5 },
  { age: 2, taille: 63 },
  { age: 3, taille: 65.5 },
  { age: 4, taille: 68 },
  { age: 5, taille: 71 },
  { age: 6, taille: 73.5 },
  { age: 7, taille: 75.5 },
  { age: 8, taille: 77.5 },
  { age: 9, taille: 79.5 },
  { age: 10, taille: 81 },
  { age: 11, taille: 82 },
  { age: 12, taille: 83 },
];

// Données de test — Poids pour la taille
const DONNEES_POIDS_TAILLE = [
  { taille: 45, poids: 2.5 },
  { taille: 50, poids: 3.0 },
  { taille: 55, poids: 3.5 },
  { taille: 60, poids: 4.0 },
  { taille: 65, poids: 4.5 },
  { taille: 70, poids: 5.1 },
  { taille: 75, poids: 5.7 },
  { taille: 80, poids: 6.4 },
  { taille: 85, poids: 7.2 },
  { taille: 90, poids: 8.0 },
  { taille: 95, poids: 8.7 },
  { taille: 100, poids: 9.4 },
  { taille: 105, poids: 10.0 },
];

const DONNEES_MUAC = [
  { age: 0, muac: 110 },
  { age: 1, muac: 111 },
  { age: 2, muac: 112 },
  { age: 3, muac: 113.5 },
  { age: 4, muac: 115 },
  { age: 5, muac: 116 },
  { age: 6, muac: 117 },
  { age: 7, muac: 118.5 },
  { age: 8, muac: 119.5 },
  { age: 9, muac: 120.5 },
  { age: 10, muac: 121.5 },
  { age: 11, muac: 123 },
  { age: 12, muac: 124.5 },
];


const graphs = [
  {
    id: 1,
    component: <PoidsAgeChart data={DONNEES_POIDS} />,
  },
  {
    id: 2,
    component: <TailleAgeChart data={DONNEES_TAILLE} />,
  },
  {
    id: 3,
    component: <PoidsTailleChart data={DONNEES_POIDS_TAILLE} />,
  },
  {
    id: 4,
    component: <MuacAgeChart data={DONNEES_MUAC} />,
  },
];

const handleBack = () => {
  navigate(location.state?.from || "/dashboard", {
    state: { draft: location.state?.draft },
  });
};

return (
  <div className="flex h-screen overflow-hidden bg-white">
  {/* Sidebar */}
 
    <Sidebar />
  
      
      <PopupDistributionfamille
  open={openDistribution}
  onClose={() => setOpenDistribution(false)}
  Distribution={distributionList}
/>

<PopupZakatFamille
  open={openZakat}
  onClose={() => setOpenZakat(false)}
  zakats={zakatList}
/>

<Popupvisites
  open={openVisites}
  onClose={() => setOpenVisites(false)}
  Visites ={visiteList}
/>

<PopupFinSuivi
  open={openFinSuivi}
  onClose={() => setOpenFinSuivi(false)}
 onConfirm={async (motif) => {
  console.log("Motif :", motif);

  // await sortirFamille(id, motif);

  if (isMobile) {
    setOpenSuccess(true);
  } else {
    setOpenFinSuivi(false);

    // Recharger la fiche
  }
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

    // ici tu recharges la fiche si besoin
  }}
/>
)}
      {/* Contenu */}
      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
     <PageHeader
  leftTitle="Revenir"
  showRight={false}
  onBack={handleBack} 
/>

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
  {famille?.mere?.prenom} {famille?.mere?.nom}
</h2>


  <span className="text-[#67A7A3] text-[18px] font-semibold">
   {famille?.id }
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

            {/* Informations administratives */}
<div className="-mt-3">
   <InfoCard
              title="Informations administratives"
              data={programme}
            />
</div>
           

            {/* Zakat + Distribution  et superive par */}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-3">
  {/* Colonne gauche */}
  <div className="flex flex-col gap-4">
  <InfoCard
  title="Zakat aid"
  action="Voir tous"
  onActionClick={() => setOpenZakat(true)}
  data={zakat}
/> 

    
 <InfoCard
    data={modification}
  />
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
        ? `${famille.coordinateur.prenom} ${famille.coordinateur.nom}`
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
    <InfoCard
      title="Informations nourrisson"
      data={nourrisson}
    />

    <InfoCard
  title="Visites"
  action="Voir tous"
  onActionClick={() => setOpenVisites(true)}
  data={visites}
/>
  </div>

  {/* Colonne droite */}
  <div className="flex flex-col gap-4">
    <InfoCard
      title="Informations mère"
      data={mere}
    />

    
  </div>

</div>


{/* ==================== Courbes OMS ==================== */}
<div className="mt-4">
 <OMSGraphs graphs={graphs} />
</div> 

{statut === "Active" && (
  <div className="mt-8 w-full">
    <Button
      title="Sortir du programme"
      variant="primary"
      noPadding
      onClick={() => setOpenFinSuivi(true)}
    />
  </div>
)}

{statut === "Sortie" && (
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
