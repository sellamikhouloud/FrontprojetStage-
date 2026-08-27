import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CheckIcon from "../../assets/check.svg";
import CloseIconRed from "../../assets/x.svg";
import CloseIcon from "../../assets/x (1).svg";
import DownloadIcon from "../../assets/download.svg";

import { exportImportRapportPdf } from "@/lib/api/donateurs";



const FIELD_LABELS = {
  ligne: "Ligne",
  email: "Email",
  nom: "Nom",
  prenom: "Prénom",
  date_adhesion: "Date adhésion",
};

const formatFieldLabel = (field) =>
  FIELD_LABELS[field] ||
  field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");

const formatErrors = (errors) => {
  if (!errors) return [];
  return Object.entries(errors).flatMap(([field, messages]) =>
    (messages || []).map((msg) => `${formatFieldLabel(field)} : ${msg}`)
  );
};



const PopupImportResult = ({ open, onClose, result }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open || !result) return null;

  const { total = 0, success_count = 0, error_count = 0, results = [] } =
    result;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const response = await exportImportRapportPdf(result);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Rapport-import-donateurs.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors du téléchargement du rapport PDF :", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[70]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center
          justify-center
          overflow-hidden
        "
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            h-[100dvh] sm:h-[640px]
            sm:w-[720px]
            sm:max-h-[88vh]
            bg-white
            rounded-none sm:rounded-[24px]
            border-0 sm:border
            flex flex-col
            overflow-hidden
          "
          style={{ borderColor: "#4E9F8A" }}
        >
        
          <div className="p-6 sm:p-8 pb-4 flex-shrink-0">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1E293B]">
                Résultats de l'import
              </h2>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="w-10 h-10 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <img src={CloseIcon} alt="" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3">
              <span className="flex-1 text-center px-4 py-2.5  rounded-[20px] border text-[15px] font-semibold bg-[#F8FBFC] border-[#E2E8F0] text-[#1E293B]">
                Total : {total}
              </span>
              <span className="flex-1 text-center px-4 py-2.5  rounded-[20px] border text-[15px] font-semibold bg-[#E8F3EF] border-[#4E9F8A] text-[#4E9F8A]">
                Réussis : {success_count}
              </span>
              <span className="flex-1 text-center px-4 py-2.5 rounded-[20px] border text-[15px] font-semibold bg-[#FEE2E2] border-[#EF4444] text-[#EF4444]">
                Erreurs : {error_count}
              </span>
            </div>
          </div>

         
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto scrollbar-hide px-6 sm:px-8 py-1">
              <div className="flex flex-col gap-3 pb-6">
                {results.map((item) => {
                  const isSuccess = item.status === "success";
                  const errorMessages = formatErrors(item.errors);

                  return (
                    <div
                      key={item.row}
                      className="bg-[#F8FBFC] border border-[#E2E8F0]  rounded-[20px] px-4 py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSuccess ? "bg-[#E8F3EF]" : "bg-[#FEE2E2]"
                          }`}
                        >
                          <img
                            src={isSuccess ? CheckIcon : CloseIconRed}
                            alt=""
                            className="w-3.5 h-3.5"
                          />
                        </span>

                        <span className="flex-1 text-[15px] text-[#1E293B]">
                          Ligne {item.row}
                          {item.email ? ` : ${item.email}` : ""}
                        </span>

                        {isSuccess && (
                          <span className="text-[13px] font-medium text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full flex-shrink-0">
                            Importé
                          </span>
                        )}
                      </div>

                      {!isSuccess &&
                        errorMessages.map((msg, i) => (
                          <p
                            key={i}
                            className="text-[13.5px] text-[#EF4444] mt-1.5 ml-10"
                          >
                            {msg}
                          </p>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>

          
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
          </div>

         
          <div className="p-6 sm:p-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 flex-shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold text-[#1E293B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <img src={DownloadIcon} alt="" className="w-4 h-4" />
              {isDownloading ? "Téléchargement..." : "Télécharger en PDF"}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-full text-[15px] font-semibold text-white bg-[#4E9F8A] hover:bg-[#448a78] transition-colors"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupImportResult;
