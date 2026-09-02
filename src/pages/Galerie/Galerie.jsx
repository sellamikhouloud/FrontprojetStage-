import { useEffect, useState } from "react";

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

import PendingPhotosPage from "../../pages/Galerie/PendingPhotosPage";

import Button from "../../components/Button/Button";

import Spinner from "../../components/Spinner";

import {
  listPhotos,
  listVillages,
  approvePhoto,
  refusePhoto,
  reexaminePhoto,
  getPendingCount,
  getBilanCandidates,
  saveBilanSelection,
} from "@/lib/api/galerie";

const mapPhotoFromApi = (photo, villagesList = []) => ({
  id: photo.id,

  title: photo.titre || "",

  description: photo.legende || "",

  village: photo.village,

  villageName:
    villagesList.find(
      (v) => String(v.id) === String(photo.village)
    )?.nom || "",

  date: photo.date_prise || "",

  image: photo.image || "",

  status:
    photo.statut === "en_attente"
      ? "pending"
      : photo.statut === "validee"
      ? "validated"
      : photo.statut === "rejetee"
      ? "refused"
      : photo.statut,

  motifRefus: photo.motif_refus || "",

  coordinator: photo.cree_par?.nom || "",

  includedInReport: photo.inclus_bilan || false,
});

const Galerie = ({ role = "coordinator" }) => {
  /*
   * ============================================================
   * ROLE HANDLING
   * ============================================================
   *
   * Admin:
   *   -> keeps the admin Galerie behavior
   *
   * Coordinator:
   *   -> uses the coordinator Galerie behavior
   *
   * Chef Coordinator:
   *   -> MUST use exactly the same Galerie behavior as coordinator
   */

  const isAdmin = role === "admin";

  const isCoordinator =
    role === "coordinator" || role === "chef_coordinator";

  /*
   * PHOTOS
   */

  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [villages, setVillages] = useState([]);

  const [pendingCount, setPendingCount] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState("all");

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  /*
   * POPUPS / PAGES
   */

  const [showPopupPhoto, setShowPopupPhoto] = useState(false);

  const [showAjouterPhoto, setShowAjouterPhoto] = useState(false);

  const [showConsulter, setShowConsulter] = useState(false);

  const [showModifier, setShowModifier] = useState(false);

  const [showRefusee, setShowRefusee] = useState(false);

  const [showEnAttente, setShowEnAttente] = useState(false);

  const [showPendingPhotosPage, setShowPendingPhotosPage] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  /*
   * SELECTION
   */

  const [selectionMode, setSelectionMode] = useState(false);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [bilanCandidates, setBilanCandidates] = useState([]);

  const [loadingBilan, setLoadingBilan] = useState(false);

  /*
   * PAGINATION
   */

const [pageSize, setPageSize] = useState(null);
const [totalItems, setTotalItems] = useState(0);
const [currentPage, setCurrentPage] = useState(1);

const totalPages = pageSize
  ? Math.ceil(totalItems / pageSize)
  : 1;

  /*
   * ============================================================
   * LOAD VILLAGES
   * ============================================================
   */

  const fetchVillages = async () => {
    try {
      const response = await listVillages();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setVillages(data);

      return data;
    } catch (err) {
      console.error(
        "Erreur lors du chargement des villages :",
        err
      );

      return [];
    }
  };

  /*
   * ============================================================
   * LOAD PHOTOS
   * ============================================================
   */

const fetchPhotos = async (
  villagesList = villages,
  page = 1,
  filter = selectedFilter,
  search = searchValue
) => {
  try {
    setLoading(true);
    setError("");

    const params = { page };

    if (filter === "validated") {
      params.statut = "validee";
    } else if (filter === "pending") {
      params.statut = "en_attente";
    } else if (filter === "refused") {
      params.statut = "rejetee";
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    const response = await listPhotos(params);
    const data = response.data;

    const results = Array.isArray(data)
      ? data
      : data?.results || [];

    const mappedPhotos = results.map((photo) =>
      mapPhotoFromApi(photo, villagesList)
    );

    setPhotos(mappedPhotos);

    /*
     * IMPORTANT:
     * Keep the backend total count.
     */
    if (data?.count !== undefined) {
      setTotalItems(data.count);
    }

    /*
     * Determine the page size from the first page only.
     */
    if (page === 1 && results.length > 0) {
      setPageSize(results.length);
    }

  } catch (err) {
    console.error("Erreur lors du chargement des photos :", err);
    setError("Impossible de charger les photos.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (loading) return;

  setCurrentPage(1);

  fetchPhotos(
    villages,
    1,
    selectedFilter,
    searchValue
  );
}, [selectedFilter]);

useEffect(() => {
  if (loading) return;

  const timeout = setTimeout(() => {
    setCurrentPage(1);

    fetchPhotos(
      villages,
      1,
      selectedFilter,
      searchValue
    );
  }, 300);

  return () => clearTimeout(timeout);
}, [searchValue]);

  /*
   * ============================================================
   * LOAD PENDING COUNT
   * ============================================================
   *
   * Only admin needs the pending counter.
   */

  const fetchPendingCount = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const response = await getPendingCount();

      setPendingCount(response.data?.count || 0);
    } catch (err) {
      console.error(
        "Erreur lors du chargement du compteur :",
        err
      );
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

useEffect(() => {
  const init = async () => {
    const villagesList = await fetchVillages();

    await fetchPhotos(
      villagesList,
      1,
      selectedFilter,
      searchValue
    );
  };

  init();

  if (isAdmin) {
    fetchPendingCount();
  }
}, [role]);

  /*
   * ============================================================
   * PHOTO CLICK
   * ============================================================
   */

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);

    if (photo.status === "validated") {
      /*
       * Validated photos:
       * both coordinator and chef_coordinator
       * use the normal consultation page.
       */
      setShowConsulter(true);
    } else if (photo.status === "pending") {
      /*
       * Admin:
       * -> pending photo approval page
       *
       * Coordinator + Chef Coordinator:
       * -> modification page
       */
      if (isAdmin) {
        setShowEnAttente(true);
      } else if (isCoordinator) {
        setShowModifier(true);
      }
    } else {
      /*
       * Refused photo
       */
      setShowRefusee(true);
    }
  };

  /*
   * ============================================================
   * PENDING PHOTOS
   * ============================================================
   */

  const pendingPhotos = photos.filter(
    (photo) => photo.status === "pending"
  );

  /*
   * ============================================================
   * SAVE MODIFIED PHOTO
   * ============================================================
   */

  const handleSavePhoto = async (updatedPhoto) => {
  setPhotos((prev) =>
    prev.map((photo) =>
      photo.id === updatedPhoto.id
        ? updatedPhoto
        : photo
    )
  );

  setSelectedPhoto(updatedPhoto);
  setShowModifier(false);

  await fetchPhotos(
    villages,
    currentPage,
    selectedFilter,
    searchValue
  );
};

  /*
   * ============================================================
   * ADD PHOTO
   * ============================================================
   */

  const handleAddPhoto = async (newPhoto) => {
  setShowAjouterPhoto(false);
  setSelectedImage(null);
  setSelectedImageFile(null);

  setCurrentPage(1);

  await fetchPhotos(
    villages,
    1,
    selectedFilter,
    searchValue
  );

  await fetchPendingCount();
};
  /*
   * ============================================================
   * IMAGE SELECTED
   * ============================================================
   */

  const handleImageSelected = (file) => {
    if (!file) {
      return;
    }

    setSelectedImageFile(file);

    setSelectedImage(URL.createObjectURL(file));
  };

  /*
   * ============================================================
   * START ADD PHOTO
   * ============================================================
   */

  const handleStartAddPhoto = () => {
    setShowPopupPhoto(false);

    setShowAjouterPhoto(true);
  };

  /*
   * ============================================================
   * BILAN CANDIDATES
   * ============================================================
   *
   * Only admin uses bilan selection.
   */

const fetchAllPhotosForBilan = async () => {
  try {
    let allPhotos = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await listPhotos({ page });

      const data = response.data;

      const results = Array.isArray(data)
        ? data
        : data?.results || [];

      const mappedPhotos = results.map((photo) =>
        mapPhotoFromApi(photo, villages)
      );

      allPhotos = [...allPhotos, ...mappedPhotos];

      /*
       * If the API is paginated and provides "next",
       * continue until there are no more pages.
       */
      if (data?.next) {
        page += 1;
      } else {
        hasNextPage = false;
      }
    }

    return allPhotos;
  } catch (err) {
    console.error(
      "Erreur lors du chargement de toutes les photos pour le bilan :",
      err
    );

    return [];
  }
};

const fetchBilanCandidates = async () => {
  if (!isAdmin) {
    return;
  }

  try {
    setLoadingBilan(true);
    setError("");

    console.log(
      "FETCH BILAN déclenché | isAdmin:",
      isAdmin,
      "| role:",
      role
    );

    /*
     * Load all photos from all pages.
     */
    const allPhotos = await fetchAllPhotosForBilan();

    console.log(
      "ALL PHOTOS FROM ALL PAGES:",
      allPhotos
    );

    /*
     * Keep ONLY validated photos From the current  Month
     */
    
      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const validatedFallback = allPhotos.filter((photo) => {
        if (photo.status !== "validated") {
          return false;
        }

        if (!photo.date) {
          return false;
        }

        const photoDate = new Date(photo.date);

        return (
          photoDate.getMonth() === currentMonth &&
          photoDate.getFullYear() === currentYear
        );
      });

    console.log(
      "ALL VALIDATED PHOTOS:",
      validatedFallback
    );

    /*
     * Try the bilan endpoint too.
     */
    const response = await getBilanCandidates();

    console.log("BILAN RESPONSE:", response?.data);

    const payload = response?.data;

    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.photos)
      ? payload.photos
      : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.results)
      ? payload.data.results
      : Array.isArray(payload?.data?.photos)
      ? payload.data.photos
      : [];

    const mapped = data.map((photo) =>
      mapPhotoFromApi(photo, villages)
    );

    /*
     * Only validated photos from the API.
     */
    const validatedFromApi = mapped.filter(
      (photo) => photo.status === "validated"
    );

    /*
     * If the bilan endpoint returns candidates,
     * use them.
     *
     * Otherwise, use ALL validated photos
     * from ALL gallery pages.
     */
    const candidates =
      validatedFromApi.length > 0
        ? validatedFromApi
        : validatedFallback;

    console.log(
      "FINAL BILAN CANDIDATES:",
      candidates
    );

    setBilanCandidates(candidates);

    const alreadyIncluded = candidates
      .filter((photo) => photo.includedInReport)
      .map((photo) => photo.id);

    setSelectedPhotos(alreadyIncluded);
  } catch (err) {
    console.error(
      "Erreur lors du chargement des candidats au bilan :",
      err
    );

    /*
     * Even if getBilanCandidates fails,
     * load all photos from all pages.
     */
    const allPhotos = await fetchAllPhotosForBilan();

    const validatedFallback = allPhotos.filter(
      (photo) => photo.status === "validated"
    );

    setBilanCandidates(validatedFallback);

    const alreadyIncluded = validatedFallback
      .filter((photo) => photo.includedInReport)
      .map((photo) => photo.id);

    setSelectedPhotos(alreadyIncluded);

    setError(
      "Impossible de charger les candidats au bilan."
    );
  } finally {
    setLoadingBilan(false);
  }
};

  /*
   * ============================================================
   * START SELECTION MODE
   * ============================================================
   */

const handleStartSelection = async () => {
  setSelectionMode(true);

  await fetchBilanCandidates();
};

  /*
   * ============================================================
   * CANCEL SELECTION MODE
   * ============================================================
   */

  const handleCancelSelection = () => {
    setSelectionMode(false);

    setSelectedPhotos([]);

    setBilanCandidates([]);
  };

  /*
   * ============================================================
   * FILTERED PHOTOS
   * ============================================================
   */

const filteredPhotos = selectionMode
  ? bilanCandidates
  : photos;

  /*
   * ============================================================
   * SAVE BILAN SELECTION
   * ============================================================
   */

const handleSaveSelection = async () => {
  try {
    setError("");

    console.log(
      "SAVING BILAN SELECTION:",
      selectedPhotos
    );

    const response = await saveBilanSelection(
      selectedPhotos
    );

    console.log(
      "BILAN SELECTION SAVED:",
      response?.data
    );

    setSelectionMode(false);
    setBilanCandidates([]);
    setSelectedPhotos([]);

    await fetchPhotos();
  } catch (err) {
    console.error(
      "ERREUR COMPLETE SAVE BILAN:",
      err
    );

    console.error(
      "RESPONSE DATA:",
      err?.response?.data
    );

    console.error(
      "RESPONSE STATUS:",
      err?.response?.status
    );

    setError(
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      "Impossible de sauvegarder la sélection."
    );
  }
};

  /*
   * ============================================================
   * TOGGLE BILAN INCLUSION
   * ============================================================
   */

  const handleToggleReport = async (photo) => {
    if (!photo?.id) {
      return;
    }

    try {
      setError("");

      const response = await getBilanCandidates();

const payload = response.data;

const data = Array.isArray(payload)
  ? payload
  : Array.isArray(payload?.results)
  ? payload.results
  : Array.isArray(payload?.photos)
  ? payload.photos
  : [];

      const currentlyIncludedIds = data
        .filter((p) => p.inclus_bilan)
        .map((p) => p.id);

      const isCurrentlyIncluded =
        currentlyIncludedIds.includes(photo.id);

      const newSelection = isCurrentlyIncluded
        ? currentlyIncludedIds.filter(
            (id) => id !== photo.id
          )
        : [...currentlyIncludedIds, photo.id];

      await saveBilanSelection(newSelection);

      /*
       * Refresh local state so inclus_bilan
       * is correct everywhere in the UI.
       */

      await fetchPhotos();

      setSelectedPhoto((prev) =>
        prev && prev.id === photo.id
          ? {
              ...prev,
              includedInReport:
                !isCurrentlyIncluded,
            }
          : prev
      );
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour du bilan :",
        err
      );

      setError(
        "Impossible de mettre à jour le bilan."
      );
    }
  };

  /*
   * ============================================================
   * APPROVE PHOTO
   * ============================================================
   */

  const handleApprovePhoto = async (photoId) => {
    try {
      await approvePhoto(photoId);

      /*
       * Don't only modify React state.
       * Reload backend data.
       */

      await fetchPhotos();

      if (isAdmin) {
        await fetchPendingCount();
      }

      setShowEnAttente(false);
    } catch (err) {
      console.error(
        "Erreur lors de l'approbation :",
        err
      );

      setError(
        "Impossible d'approuver la photo."
      );
    }
  };

  /*
   * ============================================================
   * REFUSE PHOTO
   * ============================================================
   */

  const handleRefusePhoto = async (photoId, reason) => {
    try {
      await refusePhoto(photoId, {
        motif_refus: reason,
      });

      await fetchPhotos();

      if (isAdmin) {
        await fetchPendingCount();
      }

      setShowEnAttente(false);
    } catch (err) {
      console.error(
        "Erreur lors du refus :",
        err
      );

      setError(
        "Impossible de refuser la photo."
      );
    }
  };

  /*
   * ============================================================
   * REEXAMINE PHOTO
   * ============================================================
   */

  const handleReexaminePhoto = async (photoId) => {
    try {
      await reexaminePhoto(photoId);

      await fetchPhotos();

      if (isAdmin) {
        await fetchPendingCount();
      }

      /*
       * Close the popup and go back to gallery
       * after successful reexamination.
       */

      setShowRefusee(false);
    } catch (err) {
      console.error(
        "Erreur lors du réexamen :",
        err
      );

      setError(
        "Impossible de réexaminer la photo."
      );
    }
  };

const handleNextPage = async () => {
  if (currentPage >= totalPages) return;

  const nextPage = currentPage + 1;

  setCurrentPage(nextPage);

  await fetchPhotos(
    villages,
    nextPage,
    selectedFilter,
    searchValue
  );
};

const handlePreviousPage = async () => {
  if (currentPage <= 1) return;

  const previousPage = currentPage - 1;

  setCurrentPage(previousPage);

  await fetchPhotos(
    villages,
    previousPage,
    selectedFilter,
    searchValue
  );
};

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
  return (
    <div className="h-screen bg-white flex">
      <Sidebar role={role} />
      <main className="flex-1 flex items-center justify-center">
        <Spinner />
      </main>
    </div>
    );
  }

  /*
   * ============================================================
   * GALLERY
   * ============================================================
   */

  return (
    <>
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

        <main className="flex-1 flex flex-col h-screen overflow-hidden pt-[45px] lg:pt-0">
          {/* HEADER */}

        <GalleryHeader
          role={role}
          selectionMode={selectionMode}
          onAdd={() => setShowPopupPhoto(true)}
          onSelection={isAdmin ? handleStartSelection : undefined}
          onCancelSelection={handleCancelSelection}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          photosEnAttente={pendingCount}
          photosSelectionnees={selectedPhotos.length}
          onAlertClick={() =>
            setShowPendingPhotosPage(true)
          }
        />

          {/* ERROR */}

          {error && (
            <div className="px-8 pt-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* FILTERS */}

          {!selectionMode && (
            <GalleryFilters
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}

          {/* GALLERY */}

          <div className="flex-1 overflow-y-auto">
            <GalleryGrid
              photos={filteredPhotos}
              selectedFilter={selectedFilter}
              onPhotoClick={handlePhotoClick}
              selectionMode={selectionMode}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
            />

            {/* PAGINATION */}
          {!selectionMode && totalPages > 1 && (
            <div className="flex items-center justify-center gap-20 py-6">
              <Button
                title="Précédent"
                variant="outline"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
              />

              <span className="text-sm font-medium">
                Page {currentPage} / {totalPages}
              </span>

              <Button
                title="Suivant"
                variant="filter"
                disabled={currentPage >= totalPages}
                onClick={handleNextPage}
              />
            </div>
          )}

            {/* SELECTION BUTTON */}

            {selectionMode && (
              <div className="sticky bottom-0 flex justify-end px-8 py-4 bg-white">
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

      {/* ======================================================
          POPUP PHOTO
      ====================================================== */}

      {showPopupPhoto && (
        <PopupPhoto
          open={showPopupPhoto}
          onClose={() => setShowPopupPhoto(false)}
          onImageSelected={handleImageSelected}
          onStartAddPhoto={handleStartAddPhoto}
        />
      )}

      {/* ======================================================
          AJOUTER PHOTO
      ====================================================== */}

      {showAjouterPhoto && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <AjouterPhoto
              initialImage={selectedImage}
              initialImageFile={selectedImageFile}
              onSave={handleAddPhoto}
              onClose={() => {
                setShowAjouterPhoto(false);
                setSelectedImage(null);
                setSelectedImageFile(null);
              }}
            />
          </div>

          {/* Mobile */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <AjouterPhoto
              initialImage={selectedImage}
              initialImageFile={selectedImageFile}
              onSave={handleAddPhoto}
              onClose={() => {
                setShowAjouterPhoto(false);
                setSelectedImage(null);
                setSelectedImageFile(null);
              }}
            />
          </div>
        </>
      )}

      {/* ======================================================
          CONSULTER
      ====================================================== */}

      {showConsulter && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <ConsulterPhoto
              role={role}
              photo={selectedPhoto}
              includedInReport={
                selectedPhoto?.includedInReport || false
              }
              onToggleReport={() =>
                handleToggleReport(selectedPhoto)
              }
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
              includedInReport={
                selectedPhoto?.includedInReport || false
              }
              onToggleReport={() =>
                handleToggleReport(selectedPhoto)
              }
              onEdit={() => {
                setShowConsulter(false);
                setShowModifier(true);
              }}
              onClose={() => setShowConsulter(false)}
            />
          </div>
        </>
      )}

      {/* ======================================================
          PHOTO EN ATTENTE
      ====================================================== */}

      {showEnAttente && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <PhotoEnAttente
              photo={selectedPhoto}
              onClose={() =>
                setShowEnAttente(false)
              }
              onEdit={() => {
                setShowEnAttente(false);
                setShowModifier(true);
              }}
              onApprove={() =>
                handleApprovePhoto(
                  selectedPhoto.id
                )
              }
              onConfirmRefusal={(reason) =>
                handleRefusePhoto(
                  selectedPhoto.id,
                  reason
                )
              }
            />
          </div>

          {/* Mobile */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <PhotoEnAttente
              photo={selectedPhoto}
              onClose={() =>
                setShowEnAttente(false)
              }
              onEdit={() => {
                setShowEnAttente(false);
                setShowModifier(true);
              }}
              onApprove={() =>
                handleApprovePhoto(
                  selectedPhoto.id
                )
              }
              onConfirmRefusal={(reason) =>
                handleRefusePhoto(
                  selectedPhoto.id,
                  reason
                )
              }
            />
          </div>
        </>
      )}

      {/* ======================================================
          MODIFIER
      ====================================================== */}

      {showModifier && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <ModifierPhoto
              photo={selectedPhoto}
              onClose={() =>
                setShowModifier(false)
              }
              onSave={handleSavePhoto}
            />
          </div>

          {/* Mobile */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-hidden">
            <ModifierPhoto
              photo={selectedPhoto}
              onClose={() =>
                setShowModifier(false)
              }
              onSave={handleSavePhoto}
            />
          </div>
        </>
      )}

      {/* ======================================================
          PHOTO REFUSÉE
      ====================================================== */}

      {showRefusee && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 bg-black/30 items-center justify-center z-50">
            <PhotoRefusee
              role={role}
              photo={selectedPhoto}
              onClose={() =>
                setShowRefusee(false)
              }
              onReexamine={() =>
                handleReexaminePhoto(
                  selectedPhoto.id
                )
              }
            />
          </div>

          {/* Mobile */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <PhotoRefusee
              role={role}
              photo={selectedPhoto}
              onClose={() =>
                setShowRefusee(false)
              }
              onReexamine={() =>
                handleReexaminePhoto(
                  selectedPhoto.id
                )
              }
            />
          </div>
        </>
      )}

      {/* ======================================================
          PHOTOS EN ATTENTE PAGE
      ====================================================== */}

      {showPendingPhotosPage && (
        <>
          {/* Desktop */}

          <div className="hidden lg:flex fixed inset-0 z-50 bg-white">
            <PendingPhotosPage
              role={role}
              onBack={() =>
                setShowPendingPhotosPage(false)
              }
              onApprove={handleApprovePhoto}
              onRefuse={handleRefusePhoto}
              onAddPhoto={handleAddPhoto}
            />
          </div>

          {/* Mobile */}

          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <PendingPhotosPage
              photos={pendingPhotos}
              onBack={() =>
                setShowPendingPhotosPage(false)
              }
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