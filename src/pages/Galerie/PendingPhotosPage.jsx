import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import PendingReviewCard from "../../components/Galerie/PendingReviewCard";
import PendingPhotosHeader from "../../components/Galerie/PendingHeader";
import PopupPhoto from "../../components/Popups/PopupPhoto";
import AjouterPhoto from "../../components/PhotoComposant/AjouterPhoto";

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

  // Preview URL used only for display
  const [selectedImage, setSelectedImage] = useState(null);

  // Real File object required for FormData
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  /* ================= IMAGE SELECTION ================= */

  const handleImageSelected = (file) => {
    if (!file) {
      return;
    }

    // Keep the real File for FormData
    setSelectedImageFile(file);

    // Create preview URL
    setSelectedImage(URL.createObjectURL(file));
  };

  /* ================= ADD PHOTO ================= */

  const handleStartAddPhoto = () => {
    setShowPopupPhoto(false);
    setShowAjouterPhoto(true);
  };

  const handleSavePhoto = (newPhoto) => {
    onAddPhoto(newPhoto);

    setShowAjouterPhoto(false);
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  /* ================= CLOSE ADD PHOTO ================= */

  const handleCloseAjouterPhoto = () => {
    setShowAjouterPhoto(false);
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  return (
    <div className="flex h-screen w-full min-w-0 bg-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}

      <Sidebar role={role} />

      {/* ================= CONTENT ================= */}

      <main className="flex-1 min-w-0 w-full flex flex-col overflow-hidden">
        {/* ================= HEADER ================= */}

        <PendingPhotosHeader
          photosEnAttente={photos.length}
          onBack={onBack}
          onAdd={() => setShowPopupPhoto(true)}
        />

        {/* ================= LIST ================= */}

        <div className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden px-8 py-8">
          {photos.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-[18px] text-[#9CA3AF]">
                Aucune photo en attente.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-6">
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
          {/* ================= DESKTOP ================= */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <AjouterPhoto
              initialImage={selectedImage}
              initialImageFile={selectedImageFile}
              onSave={handleSavePhoto}
              onClose={handleCloseAjouterPhoto}
            />
          </div>

          {/* ================= MOBILE ================= */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <AjouterPhoto
              initialImage={selectedImage}
              initialImageFile={selectedImageFile}
              onSave={handleSavePhoto}
              onClose={handleCloseAjouterPhoto}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PendingPhotosPage;

