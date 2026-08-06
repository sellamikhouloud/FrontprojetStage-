import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import PendingReviewCard from "../components/Galerie/PendingReviewCard";
import PendingPhotosHeader from "../components/Galerie/PendingHeader";

import PopupPhoto from "../components/Popups/PopupPhoto";
import AjouterPhoto from "../components/PhotoComposant/AjouterPhoto";

const PendingPhotosPage = ({
  photos = [],
  role = "admin",
  onBack = () => {},
  onApprove = () => {},
  onRefuse = () => {},
  onAddPhoto = () => {},
}) => {
  /* ================= POPUPS ================= */

  const [showPopupPhoto, setShowPopupPhoto] = useState(false);
  const [showAjouterPhoto, setShowAjouterPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelected = (file) => {
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleStartAddPhoto = () => {
    setShowPopupPhoto(false);
    setShowAjouterPhoto(true);
  };

  const handleSavePhoto = (newPhoto) => {
    onAddPhoto(newPhoto);
    setShowAjouterPhoto(false);
    setSelectedImage(null);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}

      <Sidebar role={role} />

      {/* ================= CONTENT ================= */}

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ================= HEADER ================= */}

        <PendingPhotosHeader
          photosEnAttente={photos.length}
          onBack={onBack}
          onAdd={() => setShowPopupPhoto(true)}
        />

        {/* ================= LIST ================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-8
            py-8
          "
        >
          {photos.length === 0 ? (
            <div
              className="
                h-full
                flex
                items-center
                justify-center
              "
            >
              <p
                className="
                  text-[18px]
                  text-[#9CA3AF]
                "
              >
                Aucune photo en attente.
              </p>
            </div>
          ) : (
            <div
              className="
                flex
                flex-col
                gap-6
              "
            >
              {photos.map((photo) => (
                <PendingReviewCard
                  key={photo.id}
                  photo={photo}
                  onApprove={() => onApprove(photo.id)}
                  onRefuse={(reason) => onRefuse(photo.id, reason)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

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
              onSave={handleSavePhoto}
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
              onSave={handleSavePhoto}
              onClose={() => {
                setShowAjouterPhoto(false);
                setSelectedImage(null);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PendingPhotosPage;