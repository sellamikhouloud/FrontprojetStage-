import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import InfoIcon from "../../assets/info.svg";
import FileIcon from "../../assets/file.svg";
import CloudUploadIcon from "../../assets/cloud-upload.svg";
import CloseIcon from "../../assets/x.svg";
import CloseIcon1 from "../../assets/x (1).svg";
import BackendErrorMessage from "../Forms/BackendErrorMessage";

const COLONNES_REQUISES = ["nom", "prénom", "email", "date d'adhésion"];
const FORMATS_ACCEPTES = [".xlsx", ".csv"];

function extractErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Une erreur est survenue.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  if (data?.detail) {
    return data.detail;
  }

  if (typeof data?.code === "string" && typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    const collect = (obj, parentLabel = "") => {
      const messages = [];
      Object.entries(obj).forEach(([field, value]) => {
        const label = parentLabel ? `${parentLabel} > ${field}` : field;
        if (Array.isArray(value)) {
          value.forEach((msg) => {
            if (typeof msg === "string") messages.push(`${label} : ${msg}`);
          });
        } else if (value && typeof value === "object") {
          messages.push(...collect(value, label));
        } else if (typeof value === "string") {
          messages.push(`${label} : ${value}`);
        }
      });
      return messages;
    };

    const messages = collect(data);
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "Une erreur est survenue.";
}

const PopupImportDonateurs = ({
  open,
  onClose,
  onImport,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setBackendError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      setSelectedFile(file);
      setBackendError(null);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();

    setSelectedFile(null);
    setBackendError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportClick = async () => {
    if (!selectedFile) return;

    setBackendError(null);

    try {
      await onImport?.(selectedFile);
    } catch (err) {
      console.error("Erreur lors de l'import du fichier :", err.response?.data || err);
      setBackendError(extractErrorMessage(err));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setBackendError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose?.();
  };

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[60]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center
          justify-center
          overflow-y-auto
          scrollbar-hide
        "
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            min-h-screen sm:min-h-0
            sm:w-[680px]
            sm:max-h-[85vh]
            overflow-y-auto
            scrollbar-hide
            bg-white
            rounded-none sm:rounded-[22px]
            border-0 sm:border
            p-6 sm:p-8
          "
          style={{ borderColor: "#E2E8F0" }}
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1E293B]">
              Importer des donateurs
            </h2>

            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="
                w-9 h-9
                rounded-full
                bg-[#F1F5F9]
                hover:bg-[#E2E8F0]
                flex items-center justify-center
                flex-shrink-0
                transition-colors
              "
            >
              <img
                src={CloseIcon1}
                alt=""
                className="w-4 h-4"
              />
            </button>
          </div>

          {/* ================= FORMATS ACCEPTÉS ================= */}
          <div className="mb-5">
            <p className="text-[15px] font-bold text-[#1E293B] mb-2.5">
              Formats acceptés
            </p>

            <div className="flex flex-wrap gap-2">
              {FORMATS_ACCEPTES.map((format) => (
                <span
                  key={format}
                  className="
                    font-mono
                    text-[13.5px]
                    font-semibold
                    px-4
                    py-1.5
                    rounded-full
                    bg-[#E8F3EF]
                    text-[#4E9F8A]
                  "
                >
                  {format}
                </span>
              ))}
            </div>
          </div>

          {/* ================= COLONNES REQUISES ================= */}
          <div className="mb-5">
            <p className="text-[15px] font-bold text-[#1E293B] mb-2.5">
              Colonnes requises :
            </p>

            <div className="flex flex-wrap gap-2">
              {COLONNES_REQUISES.map((col) => (
                <span
                  key={col}
                  className="
                    font-mono
                    text-[13.5px]
                    px-4
                    py-1.5
                    rounded-full
                    bg-[#F8FBFC]
                    border
                    border-[#E2E8F0]
                    text-black
                  "
                >
                  {col}
                </span>
              ))}
            </div>

            <p className="text-[14px] text-[#64748B] mt-2.5">
              La casse n'a pas d'importance.
            </p>
          </div>

          {/* ================= NOTES INFO ================= */}
          <div className="flex flex-col gap-3 mb-5">
            {/* Info 1 */}
            <div className="flex items-start gap-3">
              <span
                className="
                  w-7 h-7
                  rounded-full
                  bg-[#E8F3EF]
                  flex items-center justify-center
                  flex-shrink-0
                  mt-[1px]
                "
              >
                <img
                  src={InfoIcon}
                  alt=""
                  className="w-4 h-4"
                />
              </span>

              <p className="text-[14.5px] leading-[1.5] text-[#475569]">
                Tous les donateurs importés sont automatiquement actifs.
              </p>
            </div>

            {/* Info 2 */}
            <div className="flex items-start gap-3">
              <span
                className="
                  w-7 h-7
                  rounded-full
                  bg-[#E8F3EF]
                  flex items-center justify-center
                  flex-shrink-0
                  mt-[1px]
                "
              >
                <img
                  src={InfoIcon}
                  alt=""
                  className="w-4 h-4"
                />
              </span>

              <p className="text-[14.5px] leading-[1.5] text-[#475569]">
                Les lignes invalides seront signalées individuellement et
                elles ne bloquent pas l'import du reste du fichier.
              </p>
            </div>
          </div>

          {/* ================= ZONE DE DÉPÔT ================= */}
          {!selectedFile && (
            <div
              onClick={handleBrowseClick}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`
                border-2
                border-dashed
                rounded-2xl
                flex flex-col
                items-center
                justify-center
                text-center
                px-5
                py-7
                mb-4
                cursor-pointer
                transition-colors
                ${
                  isDragOver
                    ? "bg-[#E8F3EF]"
                    : "bg-[#FCFEFD]"
                }
              `}
              style={{ borderColor: "#4E9F8A" }}
            >
              {/* Icône upload */}
              <span
                className="
                  w-14 h-14
                  rounded-full
                  bg-[#E8F3EF]
                  flex items-center justify-center
                  mb-3
                "
              >
                <img
                  src={CloudUploadIcon}
                  alt=""
                  className="w-7 h-7"
                />
              </span>

              {/* Texte principal */}
              <p className="text-[16px] font-bold text-[#1E293B] mb-1.5">
                Glissez votre fichier ici
              </p>

              {/* Bouton parcourir */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                className="
                  text-[15px]
                  font-semibold
                  text-[#4E9F8A]
                  underline
                "
              >
                Parcourir
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* ================= FICHIER SÉLECTIONNÉ ================= */}
          {selectedFile && (
            <div
              className="
                flex items-center
                gap-3
                bg-[#F8FBFC]
                border
                border-[#E2E8F0]
                rounded-xl
                px-4
                py-3.5
                mb-5
              "
            >
              {/* Icône fichier */}
              <span
                className="
                  w-10 h-10
                  rounded-lg
                  bg-[#E8F3EF]
                  flex items-center justify-center
                  flex-shrink-0
                "
              >
                <img
                  src={FileIcon}
                  alt=""
                  className="w-5 h-5"
                />
              </span>

              {/* Nom fichier */}
              <span
                className="
                  flex-1
                  text-[15px]
                  font-medium
                  text-[#1E293B]
                  truncate
                "
              >
                {selectedFile.name}
              </span>

              {/* Supprimer */}
              <button
                onClick={handleRemoveFile}
                aria-label="Supprimer le fichier"
                className="
                  w-8 h-8
                  rounded-full
                  bg-[#FEE2E2]
                  hover:bg-[#FCA5A5]
                  flex items-center justify-center
                  flex-shrink-0
                  transition-colors
                "
              >
                <img
                  src={CloseIcon}
                  alt=""
                  className="w-3.5 h-3.5"
                />
              </button>
            </div>
          )}

          {/* ================= ERREUR BACKEND (fichier absent / format invalide / colonnes manquantes) ================= */}
          <BackendErrorMessage message={backendError} className="mb-5" />

          {/* ================= FOOTER ================= */}
          <div
            className="
              flex flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-2.5
              mt-1
            "
          >
            {/* Annuler */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="
                w-full
                sm:w-auto
                px-7
                py-3
                rounded-full
                text-[15px]
                font-semibold
                text-[#1E293B]
                bg-white
                border
                border-[#E2E8F0]
                hover:bg-[#F8FAFC]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              Annuler
            </button>

            {/* Importer */}
            <button
              onClick={handleImportClick}
              disabled={!selectedFile || isLoading}
              className="
                w-full
                sm:w-auto
                px-7
                py-3
                rounded-full
                text-[15px]
                font-semibold
                text-white
                bg-[#4E9F8A]
                hover:bg-[#448a78]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              {isLoading ? "Importation..." : "Importer"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupImportDonateurs;
