import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import GalleryHeader from "../components/Galerie/GalleryHeader";
import GalleryFilters from "../components/Galerie/GalleryFilters";
import GalleryGrid from "../components/Galerie/GalleryGrid";

import PopupPhoto from "../components/Popups/PopupPhoto";
import AjouterPhoto from "../components/PhotoComposant/AjouterPhoto";
import ConsulterPhoto from "../components/PhotoComposant/ConsulterPhoto";
import ModifierPhoto from "../components/PhotoComposant/ModifierPhoto";
import PhotoRefusee from "../components/PhotoComposant/PhotoRefusee";

import img1 from "../assets/Valide.svg";
import img2 from "../assets/Valide.svg";
import img3 from "../assets/Valide.svg";
import img4 from "../assets/Valide.svg";
import img5 from "../assets/Valide.svg";

const initialPhotos = [
  {
    id: 1,
    title: "Inventaire logistique – Guidikhama",
    village: "Guidikhama",
    date: "12 mars 2026",
    description:
      "Contrôle de l'inventaire des fournitures médicales au centre de santé de Guidikhama. Vérification de la disponibilité des médicaments essentiels, des kits de dépistage nutritionnel et du matériel de soins avant les activités communautaires.",
    image: img1,
    status: "refused",
    motifRefus:
      "Visage d'un personnel identifiable en arrière-plan. Veuillez recadrer ou utiliser une autre prise de vue.",
  },
  {
    id: 2,
    title: "Distribution kits",
    village: "Tenali",
    date: "12 mars 2026",
    description:
      "Session de distribution mensuelle réalisée au centre de santé de Tenali. 45 familles ont reçu des suppléments nutritionnels et des conseils d'hygiène.",
    image: img2,
    status: "validated",
  },
  {
    id: 3,
    title: "Matériel de mesure",
    village: "Awoycheu",
    date: "17 mars 2026",
    description:
      "Présentation et vérification du matériel anthropométrique utilisé lors du suivi nutritionnel des enfants bénéficiaires.",
    image: img3,
    status: "validated",
  },
  {
    id: 4,
    title: "Formation ambassadeurs",
    village: "Sélibaby",
    date: "21 mars 2026",
    description:
      "Formation des ambassadeurs communautaires sur les bonnes pratiques nutritionnelles, les techniques de sensibilisation et le suivi des familles.",
    image: img4,
    status: "pending",
  },
  {
    id: 5,
    title: "Réunion communautaire",
    village: "Danguérémou",
    date: "27 mars 2026",
    description:
      "Réunion avec les représentants de la communauté afin de présenter les résultats du programme nutritionnel et préparer les prochaines distributions.",
    image: img5,
    status: "refused",
    motifRefus:
      "Un bénéficiaire mineur est clairement identifiable sur la photo. Une nouvelle photo respectant les règles de confidentialité est requise.",
  },
];

const Galerie = () => {
  const [photos, setPhotos] = useState(initialPhotos);

  const [selectedFilter, setSelectedFilter] = useState("all");

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  // Popups / Pages
  const [showPopupPhoto, setShowPopupPhoto] = useState(false);

  const [showAjouterPhoto, setShowAjouterPhoto] = useState(false);

  const [showConsulter, setShowConsulter] = useState(false);

  const [showModifier, setShowModifier] = useState(false);

  const [showRefusee, setShowRefusee] = useState(false);

  const [searchValue, setSearchValue] = useState("");


  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);

    if (photo.status === "validated") {
      setShowConsulter(true);
    } else if (photo.status === "pending") {
      setShowModifier(true);
    } else {
      setShowRefusee(true);
    }
  };

  const handleSavePhoto = (updatedPhoto) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === updatedPhoto.id
          ? updatedPhoto
          : photo
      )
    );

    setSelectedPhoto(updatedPhoto);
    setShowModifier(false);
  };

  const handleAddPhoto = (newPhoto) => {
    setPhotos((prevPhotos) => [
      newPhoto,
      ...prevPhotos,
    ]);

    setShowAjouterPhoto(false);
    setSelectedImage(null);
  };

  const handleImageSelected = (file) => {
    setSelectedImage(
      URL.createObjectURL(file)
    );
  };

  const handleStartAddPhoto = () => {
    setShowPopupPhoto(false);
    setShowAjouterPhoto(true);
  };

  const filteredPhotos = photos.filter((photo) =>
    photo.title
    .toLowerCase()
    .includes(searchValue.toLowerCase())
  );
  return (
    <>
      {/* Gallery */}
      <div
        className={`${
          showAjouterPhoto ||
          showModifier ||
          showConsulter ||
          showRefusee
            ? "hidden lg:flex"
            : "flex"
        } h-screen overflow-hidden bg-white`}
      >
        <Sidebar role="coordinator" />

        <main className="flex-1">
          <GalleryHeader
            onAdd={() => setShowPopupPhoto(true)}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <GalleryFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />

          <GalleryGrid
            photos={filteredPhotos}
            selectedFilter={selectedFilter}
            onPhotoClick={handlePhotoClick}
          />
        </main>
      </div>
    {/* ================= POPUP PHOTO ================= */}

      {showPopupPhoto && (
        <PopupPhoto
          open={showPopupPhoto}
          onClose={() => setShowPopupPhoto(false)}
          onImageSelected={handleImageSelected}
          onStartAddPhoto={handleStartAddPhoto}
        />
      )}

    {/* ================= AJOUTER PHOTO ================= */}

      {showAjouterPhoto && (
        <>
          {/* Desktop */}
          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
           <AjouterPhoto
            initialImage={selectedImage}
            onSave={handleAddPhoto}
            onClose={() => {
                setShowAjouterPhoto(false);
                setSelectedImage(null);
            }}
           />
          </div>

          {/* Mobile */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
          <AjouterPhoto
            initialImage={selectedImage}
            onSave={handleAddPhoto}
            onClose={() => {
                setShowAjouterPhoto(false);
                setSelectedImage(null);
            }}
          />
          </div>
        </>
      )}

    {/* ================= CONSULTER ================= */}

      {showConsulter && (
        <>
          {/* Desktop */}
          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <ConsulterPhoto
              photo={selectedPhoto}
              onClose={() => setShowConsulter(false)}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <ConsulterPhoto
              photo={selectedPhoto}
              onClose={() => setShowConsulter(false)}
            />
          </div>
        </>
      )}

    {/* ================= MODIFIER ================= */}

      {showModifier && (
        <>
          {/* Desktop */}
          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <ModifierPhoto
              photo={selectedPhoto}
              onClose={() => setShowModifier(false)}
              onSave={handleSavePhoto}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-hidden">
            <ModifierPhoto
              photo={selectedPhoto}
              onClose={() => setShowModifier(false)}
              onSave={handleSavePhoto}
            />
          </div>
        </>
      )}

    {/* ================= REFUSÉE ================= */}

      {showRefusee && (
        <>
          {/* Desktop */}
          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <PhotoRefusee
              photo={selectedPhoto}
              onClose={() => setShowRefusee(false)}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <PhotoRefusee
              photo={selectedPhoto}
              onClose={() => setShowRefusee(false)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Galerie;
