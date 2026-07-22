import { useState } from "react";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import InfoCard from "../components/Containers/AfficherContainer";
import Sidebar from "../components/Sidebar/Sidebar";
import StatusBadge from "../components/Cards/Badge";
import PopupDistributionfamille from "../components/Popups/PopupDistributionfamille";
import Button from "../components/Button/Button";
import Popupvisites from "../components/Popups/Popupvisitefamille"
import MotherPhoto from "../assets/photo mere.svg";
import EditableInfoCard from "../components/Containers/ModifierContainer";
import PopupFinSuivi from "../components/Popups/PopupFinsuivi";
import Popup from "../components/Popups/SuccessPopup.jsx";
import { useNavigate, useParams } from "react-router-dom";


const Modifyfamilly = () => {
    
const navigate = useNavigate();

const { id } = useParams();
  const [nourrisson, setNourrisson] = useState([
    { label: "Date de naissance", value: "15/05/2026" },
    { label: "Sexe", value: "Masculin" },
    { label: "Poids de naissance", value: "500 g" },
    { label: "Taille de naissance", value: "35 cm" },
  ]);

  const [mere, setMere] = useState([
    { label: "Village", value: "Lexeiba" },
    { label: "Téléphone", value: "24123456" },
    
  ]);

  const [programme, setProgramme] = useState([
  {
    label: "Date d'entrée dans le programme",
    value: "16/05/2026",
  },
]);

  const handleNourrissonChange = (index, value) => {
  setNourrisson((prev) =>
    prev.map((item, i) =>
      i === index
        ? { ...item, value }
        : item
    )
  );
};

const handleMereChange = (index, value) => {
  setMere((prev) =>
    prev.map((item, i) =>
      i === index
        ? { ...item, value }
        : item
    )
  );
};
 


const handleProgrammeChange = (index, value) => {
  setProgramme((prev) =>
    prev.map((item, i) =>
      i === index
        ? { ...item, value }
        : item
    )
  );
};
 const handleSuperviseurChange = (index, value) => {
  setSuperviseur((prev) =>
    prev.map((item, i) =>
      i === index
        ? { ...item, value }
        : item
    )
  );
};

  const zakat = [
    {
      label: "Nombre d'aides",
      value: "6",
    },
    {
      label: "Montant total",
      value: "4000 MRU",
    },
  ];

  const distributions = [
    {
      label: "Nombre de distributions",
      value: "4",
    },
  ];

  const visites = [
    {
      label: "Nombre de visites",
      value: "6",
    },
    {
      label: "Date de la dernière visite",
      value: "15/08/2026",
    },
  ];

const [superviseur, setSuperviseur] = useState([
  {
    label: "Nom du coordinateur",
    value: "Kshfhd Qdjshf",
  },
]);
const [openDistribution, setOpenDistribution] = useState(false);
const [openVisites, setOpenVisites] = useState(false);
const distributionList = [
  {
    id: 1,

    // Informations de la carte
    distribution: "Distribution 1",
    date: "15/05/2026",
    produits: [
      { nom: "Lait thérapeutique", quantite: "2 boîtes" },
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

    colisAlimentaire: [
      {
        label: "Farine",
        value: "4 kg",
      },
      {
        label: "Huile",
        value: "2 L",
      },
    ],
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

    colisAlimentaire: [
      {
        label: "Riz",
        value: "3 kg",
      },
      {
        label: "Lentilles",
        value: "2 kg",
      },
      {
        label: "Sel",
        value: "1 kg",
      },
      {
        label: "Sucre",
        value: "1 kg",
      },
    ],
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

    statuts: [
      {
        type: "mam",
        text: "MAS nourrisson",
      },
      {
        type: "mere",
        text: "Mère normale",
      },
    ],

    observationNourrisson: "Observation nourrisson",

    observationMere: "Observation mère",

    evaluationFamiliale: "Famille stable",

    visite: "Visite 1",

    poids: "500",

    taille: "35",

    badges: [
      {
        type: "mam",
        text: "MAS nourrisson",
      },
      {
        type: "mere",
        text: "Mère normale",
      },
    ],
  },
];

const [openFinSuivi, setOpenFinSuivi] = useState(false);
return (
 <div className="flex h-screen overflow-hidden bg-white">
   {/* Sidebar */}

     <Sidebar role="admin" />
  
    
      <PopupDistributionfamille
  open={openDistribution}
  onClose={() => setOpenDistribution(false)}
  Distribution={distributionList}
/>

<Popupvisites
  open={openVisites}
  onClose={() => setOpenVisites(false)}
  Visites ={visiteList}
/>

<PopupFinSuivi
  open={openFinSuivi}
  onClose={() => setOpenFinSuivi(false)}
  onConfirm={(motif) => {
    console.log("Motif :", motif);

    // Ici API

    setOpenFinSuivi(false);
  }}
/>
      {/* Contenu */}
    <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={() => window.history.back()}
        />

     <NavigationHeader
  title="Fiche famille"
  type="save"
  actionTitle="Enregistrer les modifications"
  onAction={() => {
    // TODO: Save to your API here

    navigate(`/famille/${id}`);
  }}
/>
        {/* ==================== HAUT ==================== */}

     <div className="grid grid-cols-1 xl:grid-cols-[520px_minmax(0,1fr)] gap-6 xl:gap-10 mb-8">
          {/* Photo */}
       
<div className="w-full lg:w-[520px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[331px] rounded-[15px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
  <img
    src={MotherPhoto}
    alt="Photo de la mère"
    className="w-full h-full object-cover"
  />
</div>

          {/* Partie droite */}
        <div className="min-h-[331px] flex flex-col gap-4">

            {/* Nom */}
          <div className="flex items-center justify-between">
  <h2 className="text-[26px] font-bold text-[#202124]">
    Aïcha Mint Mohamed
  </h2>

  <span className="text-[#67A7A3] text-[18px] font-semibold">
    GDK-2026-003
  </span>
</div>

            {/* Statuts */}
         
      <div className="flex flex-col gap-3">

 <StatusBadge
  type="mereActive"
  text="Active"
  className="w-full h-[40px] rounded-[10px]"
/>

  <div className="grid grid-cols-2 gap-1">
    <StatusBadge
      type="mas"
      text="MAS nourrisson"
      className="w-full h-[40px] rounded-[10px]"
    />

   <StatusBadge
  type="mereNormal"
  text="Mère normale"
  className="w-full h-[40px] rounded-[10px]"
/>
  </div>

</div>

            {/* Informations administratives */}
<div className="-mt-3"> 
  <EditableInfoCard
  title="Informations administratives"
  data={programme}
  editable={true}
  onChange={handleProgrammeChange}
/></div>
          

            {/* Zakat + Distribution et supervise par */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-3">
  {/* Colonne gauche */}
  <div className="flex flex-col gap-4">
    <InfoCard
      title="Zakat aid"
      data={zakat}
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
<EditableInfoCard
  title="Supervisé par"
  data={superviseur}
  editable={true}
  onChange={handleSuperviseurChange}
/>
  </div>
</div>

          </div>
        </div>

        {/* ==================== BAS ==================== */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-3">

  {/* Colonne gauche */}
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

  {/* Colonne droite */}
  <div className="flex flex-col gap-4">
  <EditableInfoCard
  title="Informations mère"
  data={mere}
  editable={true}
  onChange={handleMereChange}
/>

    
  </div>

</div>
<div className="mt-8 w-full">
  <Button
    title="Sortir du programme"
    variant="primary"
    noPadding
    onClick={() => setOpenFinSuivi(true)}
  />
</div>
      </main>
    </div>
  
);
};

export default Modifyfamilly ;

