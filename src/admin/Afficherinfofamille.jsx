import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NavigationHeader from "../components/NavigationHeader";
import InfoCard from "../components/AfficherContainer";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/Badge";
import PopupDistributionfamille from "../components/PopupDistributionfamille";
import Button from "../components/Button";
import Popupvisites from "../components/Popupvisitefamille"
import MotherPhoto from "../assets/photo mere.svg";
import { useNavigate, useParams } from "react-router-dom";


const FamilyProfile = () => {
    const navigate = useNavigate();
const { id } = useParams();
  const nourrisson = [
    { label: "Date de naissance", value: "15/05/2026" },
    { label: "Sexe", value: "Masculin" },
    { label: "Poids de naissance", value: "500 g" },
    { label: "Taille de naissance", value: "35 cm" },
  ];

  const mere = [
    { label: "Village", value: "Lexeiba" },
    { label: "Téléphone", value: "24123456" },
    { label: "Date de naissance", value: "15/05/1990" },
    { label: "Statut matrimonial", value: "Mariée" },
    { label: "Nombre d'enfants à charge", value: "2" },
    { label: "Référent médical", value: "Mariam Diallo" },
  ];

 
  const programme = [
    
      { label: "Date d'entrée dans le programme",
      value: "16/05/2026"},
      
    
  ];

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


const superviseur = [
  {
    label: "Nom du coordinateur",
    value: "Kshfhd Qdjshf",
  },
];
const [openDistribution, setOpenDistribution] = useState(false);
const [openVisites, setOpenVisites] = useState(false);
const distributionList = [
  {
    id: 1,
    distribution: "Distribution 1",
    date: "15/05/2026",
    produits: [
      { nom: "Lait thérapeutique", quantite: "2 kg" },
      { nom: "Huile", quantite: "1 L" },
      { nom: "Riz", quantite: "5 kg" },
    ],
  },
];


const visiteList = [
  {
    id: 1,
    enfant: "Aïcha Mint Mohamed",
    code: "GDK-2026-003",
    visite: "Visite 1",
    date: "15/05/2026",
    poids: "500",
    taille: "35",
    badges: [
      {
        type: "mas",
        text: "MAS nourrisson",
      },
      {
        type: "mere",
        text: "Mère normale",
      },
    ],
  },
  {
    id: 2,
    enfant: "Aïcha Mint Mohamed",
    code: "GDK-2026-003",
    visite: "Visite 2",
    date: "15/06/2026",
    poids: "650",
    taille: "38",
    badges: [
      {
        type: "mam",
        text: "MAM nourrisson",
      },
      {
        type: "mere",
        text: "Mère normale",
      },
    ],
  },
];
return (
  <div className="min-h-screen px-4 py-4 md:p-6 ">
    <div className="flex md:gap-8 items-start">
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
      {/* Contenu */}
      <main className="w-full flex-1 pt-16 md:pt-0 overflow-y-auto">
     <PageHeader
  leftTitle="Revenir"
  showRight={false}
  onBack={() => navigate("/liste-famille")}
/>

       <NavigationHeader
  title="Fiche famille"
  type="edit"
  actionTitle="Modifier la fiche famille"
  onAction={() => navigate(`/famille/${id}/modifier`)}
/>

        {/* ==================== HAUT ==================== */}

     <div className="grid grid-cols-1 lg:grid-cols-[520px_minmax(0,1fr)] gap-10 mb-8">
          {/* Photo */}
         {/* Photo */}
<div className="w-full lg:w-[520px] h-[331px] rounded-[15px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
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

            <InfoCard
              title="Informations administratives"
              data={programme}
            />

            {/* Zakat + Distribution */}

          <div className="grid grid-cols-2 gap-4">
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

    <InfoCard
      title="Supervise par"
      data={[
        {
          label: "Nom du coordinateur",
          value: "Kshfhd Qdjshf",
        },
      ]}
    />
  </div>
</div>

          </div>
        </div>

        {/* ==================== BAS ==================== */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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


<div className="mt-8 w-full">
  <Button
    title="Sortir du programme "
    variant="primary"
    noPadding
    onClick={() => console.log("Enregistrer")}
  />
</div>
      </main>
    </div>
  </div>
);
};

export default FamilyProfile;