import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import GalleryHeader from "../../components/Galerie/GalleryHeader";
import GalleryFilters from "../../components/Galerie/GalleryFilters";
import GalleryGrid from "../../components/Galerie/GalleryGrid";

import PopupPhoto from "../../components/Popups/PopupPhoto";
import AjouterPhoto from "../../components/PhotoComposant/AjouterPhoto";
import ConsulterPhoto from "../../components/PhotoComposant/ConsulterPhoto";
import ModifierPhoto from "../../components/PhotoComposant/ModifierPhoto";
import PhotoRefusee from "../../components/PhotoComposant/PhotoRefusee";
import PhotoEnAttente from "../../components/PhotoComposant/PhotoEnAttente";


import Button from "../../components/Button/Button";

import img1 from "../../assets/Valide.svg";
import img2 from "../../assets/Valide.svg";
import img3 from "../../assets/Valide.svg";
import img4 from "../../assets/Valide.svg";
import img5 from "../../assets/Valide.svg";

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

const Galerie = ({ role = "coordinator" }) => {
  const isAdmin = role === "admin";

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

  const [showEnAttente, setShowEnAttente] = useState(false);

  const [showPendingPhotosPage, setShowPendingPhotosPage] = useState(false);

  const handlePhotoClick = (photo) => {
  setSelectedPhoto(photo);

  if (photo.status === "validated") {
      setShowConsulter(true);
    } else if (photo.status === "pending") {
      if (role === "admin") {
        setShowEnAttente(true);
      } else {
        setShowModifier(true);
      }
    } else {
      setShowRefusee(true);
    }
  };

  const photosEnAttente = photos.filter(
  (photo) => photo.status === "pending"
  ).length;

  const pendingPhotos = photos.filter(
  (photo) => photo.status === "pending"
  );

  // Selection
  const [selectionMode,setSelectionMode] = useState(false);
  const [selectedPhotos,setSelectedPhotos] = useState([]);

  // handles
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

  const filteredPhotos = photos
  .filter((photo) =>
    photo.title
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )
  .filter((photo) =>
    selectionMode
      ? photo.status === "validated"
      : true
  );

  const handleSaveSelection = () => {
  console.log(selectedPhotos);

  // Later:
  // send selectedPhotos to the backend
  // navigate to the report page
  };

  const handleApprovePhoto = (photoId) => {
  setPhotos((prev) =>
    prev.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            status: "validated",
          }
        : photo
    )
  );
};

const handleRefusePhoto = (photoId, reason) => {
  setPhotos((prev) =>
    prev.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            status: "refused",
            motifRefus: reason,
          }
        : photo
    )
  );
};

    return (
    <>
      {/* Gallery */}
      <div
        className={`${
          showAjouterPhoto ||
          showModifier ||
          showConsulter ||
          showRefusee ||
          showEnAttente ||
          showPendingPhotosPage
            ? "hidden lg:flex"
            : "flex"
        } h-screen bg-white overflow-hidden`}
      >
        <Sidebar role={role} />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Fixed Header */}
          <GalleryHeader
            role={role}
            selectionMode={selectionMode}
            onAdd={() => setShowPopupPhoto(true)}
            onSelection={() => setSelectionMode(true)}
            onCancelSelection={() => {
              setSelectionMode(false);
              setSelectedPhotos([]);
            }}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            photosEnAttente={photosEnAttente}
            photosSelectionnees={selectedPhotos.length}
            onAlertClick={() => setShowPendingPhotosPage(true)}
          />

          {/* Fixed Filters */}
          <GalleryFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />

          {/* Scrollable Gallery */}
          <div className="flex-1 overflow-y-auto">
            <GalleryGrid
              photos={filteredPhotos}
              selectedFilter={selectedFilter}
              onPhotoClick={handlePhotoClick}
              selectionMode={selectionMode}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
            />
             {selectionMode && (
              <div
                className="
                  sticky
                  bottom-0
                  flex
                  justify-end
                  px-8
                  py-4
                  bg-white
                "
              >
                <Button
                  title="Sauvegarder les photos"
                  variant="changer"
                  noWrapperPadding
                  onClick={handleSaveSelection}
                />
              </div>
            )}
          </div>

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
              role={role}
              photo={selectedPhoto}
              includedInReport={selectedPhotos.includes(selectedPhoto?.id)}
              onToggleReport={() => {
                if (selectedPhotos.includes(selectedPhoto.id)) {
                  setSelectedPhotos(prev =>
                    prev.filter(id => id !== selectedPhoto.id)
                  );
                } else {
                  setSelectedPhotos(prev => [
                    ...prev,
                    selectedPhoto.id,
                  ]);
                }
              }}
              onEdit={() => {
                setShowConsulter(false);
                setShowModifier(true);
              }}
              onClose={() => setShowConsulter(false)}
            />
                      </div>

                      {/* Mobile */}
                      <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <ConsulterPhoto
              role={role}
              photo={selectedPhoto}
              includedInReport={selectedPhotos.includes(selectedPhoto?.id)}
              onToggleReport={() => {
                if (selectedPhotos.includes(selectedPhoto.id)) {
                  setSelectedPhotos(prev =>
                    prev.filter(id => id !== selectedPhoto.id)
                  );
                } else {
                  setSelectedPhotos(prev => [
                    ...prev,
                    selectedPhoto.id,
                  ]);
                }
              }}
              onEdit={() => {
                setShowConsulter(false);
                setShowModifier(true);
              }}
              onClose={() => setShowConsulter(false)}
            />
          </div>
        </>
      )}

      {/* ================= PHOTO EN ATTENTE ================= */}

        {showEnAttente && (
          <>
            {/* Desktop */}
            <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
              <PhotoEnAttente
                photo={selectedPhoto}
                onClose={() => setShowEnAttente(false)}

                onEdit={() => {
                  setShowEnAttente(false);
                  setShowModifier(true);
                }}

                onApprove={() => {
                  setPhotos((prev) =>
                    prev.map((p) =>
                      p.id === selectedPhoto.id
                        ? { ...p, status: "validated" }
                        : p
                    )
                  );

                  setShowEnAttente(false);
                }}

                onConfirmRefusal={(reason) => {
                  setPhotos((prev) =>
                    prev.map((p) =>
                      p.id === selectedPhoto.id
                        ? {
                            ...p,
                            status: "refused",
                            motifRefus: reason,
                          }
                        : p
                    )
                  );

                  setShowEnAttente(false);
                }}
              />
            </div>

            {/* Mobile */}
            <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
              <PhotoEnAttente
                photo={selectedPhoto}
                onClose={() => setShowEnAttente(false)}

                onEdit={() => {
                  setShowEnAttente(false);
                  setShowModifier(true);
                }}

                onApprove={() => {
                  setPhotos((prev) =>
                    prev.map((p) =>
                      p.id === selectedPhoto.id
                        ? { ...p, status: "validated" }
                        : p
                    )
                  );

                  setShowEnAttente(false);
                }}

                onConfirmRefusal={(reason) => {
                  setPhotos((prev) =>
                    prev.map((p) =>
                      p.id === selectedPhoto.id
                        ? {
                            ...p,
                            status: "refused",
                            motifRefus: reason,
                          }
                        : p
                    )
                  );

                  setShowEnAttente(false);
                }}
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

      {showPendingPhotosPage && (
  <>
    {/* ================= Photos En Attente ================= */}

    {/* Desktop */}
    <div className="hidden lg:flex fixed inset-0 z-50 bg-white">
      <PendingPhotosPage
        photos={pendingPhotos}
        onBack={() => setShowPendingPhotosPage(false)}
        onApprove={handleApprovePhoto}
        onRefuse={handleRefusePhoto}
        onAddPhoto={handleAddPhoto}
      />
    </div>

    {/* Mobile */}
    <div className="lg:hidden fixed inset-0 z-50 bg-white">
      <PendingPhotosPage
        photos={pendingPhotos}
        onBack={() => setShowPendingPhotosPage(false)}
        onApprove={handleApprovePhoto}
        onRefuse={handleRefusePhoto}
        onAddPhoto={handleAddPhoto}
      />
    </div>
  </>
)}
    </>
  );
};

export default Galerie;