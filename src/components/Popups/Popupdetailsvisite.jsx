import Card from "../Cards/Card";
import StatusBadge from "../Cards/Badge";
import InfoCard from "../Containers/AfficherContainer";
import AfficherMesure from "../Containers/AfficherMesure";
import Button from "../Button/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";
import ZScoreBox from "../Containers/ZScoreBox";

const PopupDetailVisite = ({
  open,
  onClose,
  visite,
  famille,
  onEdit,
  onDelete,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  if (!open || !visite) return null;

  const isAnnulee = visite?.annule === true;

  // Redirection vers la fiche famille avec retour vers /liste-visite
  const handleGoToFamille = () => {
    if (!famille?.id) return;
    navigate(`/famille/${famille.id}`, {
      state: {
        restoreVisiteId: visite.id,
        fromPage: "/liste-visite", // Mis à jour avec /liste-visite
      },
    });
  };

  const infosGenerales = [
    {
      label: "Date",
      value: visite.date_visite
        ? new Date(visite.date_visite).toLocaleDateString("fr-FR")
        : "-",
    },
    { label: "Visite n°", value: visite.numero_visite ?? "-" },
    {
      label: "Créé par",
      value: visite.audit?.cree_par
        ? `${visite.audit.cree_par.nom} ${visite.audit.cree_par.prenom}`
        : "-",
    },
    {
      label: "Date de création",
      value: visite.audit?.date_creation
        ? new Date(visite.audit.date_creation).toLocaleDateString("fr-FR")
        : "-",
    },
    {
      label: "Modifié par",
      value: visite.audit?.modifie_par
        ? `${visite.audit.modifie_par.nom} ${visite.audit.modifie_par.prenom}`
        : "-",
    },
    {
      label: "Date de modification",
      value: visite.audit?.date_modification
        ? new Date(visite.audit.date_modification).toLocaleDateString("fr-FR")
        : "-",
    },
  ];

  const statutBadges = [
    visite?.statut_nutritionnel === "mam" && {
      type: "mam",
      text: "MAM nourrisson",
    },
    visite?.statut_nutritionnel === "mas" && {
      type: "mas",
      text: "MAS nourrisson",
    },
    visite?.statut_nutritionnel === "normale" && {
      type: "mere",
      text: "Nourrisson normal",
    },
    visite?.statut_nutritionnel_mere === "normale" && {
      type: "mere",
      text: "Mère normale",
    },
    visite?.statut_nutritionnel_mere === "a_risque" && {
      type: "risque",
      text: "Mère à risque",
    },
    visite?.statut_nutritionnel_mere === "malnutrition" && {
      type: "mas",
      text: "Mère malnutrie",
    },
  ].filter(Boolean);

  const StatutCalculeBlock = () => (
    <div className="w-full rounded-[20px] border border-[#E6ECEA] bg-[#F8FBFC] px-[15px] py-3 flex flex-col">
      <h3 className="text-[18px] font-semibold text-center text-[#202124] mb-3">
        Statut calculé
      </h3>
      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3">
        {statutBadges.map((badge, index) => (
          <StatusBadge
            key={`${badge.type}-${index}`}
            type={badge.type}
            text={badge.text}
            className="h-[44px] sm:h-[50px] flex-1 sm:flex-none min-w-0 sm:min-w-[190px] rounded-[18px] text-[14px] sm:text-[16px] font-semibold px-4 sm:px-6"
          />
        ))}
      </div>
    </div>
  );

  const ActionButtons = ({ className }) => {
    if (isAnnulee) return null;
    return (
      <div className={className}>
        <Button
          title="Modifier"
          variant="modifier"
          icon={EditIcon}
          noWrapperPadding
          onClick={() => onEdit?.(visite)}
        />
        <Button
          title="Annuler"
          variant="supprimer"
          icon={DeleteIcon}
          noWrapperPadding
          onClick={() => setShowDeletePopup(true)}
        />
      </div>
    );
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete?.(visite);
    } finally {
      setIsDeleting(false);
      setShowDeletePopup(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] bg-transparent sm:bg-black/40 flex items-start sm:items-center justify-center overflow-y-auto scrollbar-hide"
        onClick={onClose}
      >
        {showDeletePopup && (
          <div onClick={(e) => e.stopPropagation()}>
            <Popup
              title="Confirmer l'annulation"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir Annuler cette visite ? Cette action est irréversible."
              primaryButtonText={isDeleting ? "Annulation..." : "Annuler la visite"}
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={handleConfirmDelete}
              onSecondaryClick={() => setShowDeletePopup(false)}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full min-h-screen sm:min-h-0 sm:w-[952px] sm:max-h-[90vh] overflow-y-auto scrollbar-hide bg-white rounded-none sm:rounded-[20px] border-0 sm:border p-4 sm:p-6"
          style={{ borderColor: "#4E9F8A" }}
        >
          {/* Header */}
          <div className="mb-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[17px] text-[#202124] hover:opacity-70 transition"
            >
              <img src={quitter} alt="Fermer" className="w-5 h-5" />
              Fermer
            </button>

            <h2 className="mt-2 text-center text-[20px] font-bold">
              Détail de la visite n°{visite.numero_visite ?? "-"}
            </h2>
          </div>

          {/* Carte famille cliquable */}
          <div onClick={handleGoToFamille} className="cursor-pointer hover:opacity-95 transition">
            <Card
              mere={`${famille?.mere?.nom ?? ""} ${famille?.mere?.prenom ?? ""}`}
              enfant={famille?.nourrisson?.prenom}
              sexe={
                famille?.nourrisson?.sexe === "M"
                  ? "Fils"
                  : famille?.nourrisson?.sexe === "F"
                  ? "Fille"
                  : "-"
              }
              region={famille?.mere?.village?.nom ?? "-"}
              naissance={famille?.nourrisson?.date_naissance ?? "-"}
              code={famille?.id ?? "-"}
              badges={[]}
            />
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              <InfoCard title="Informations générales" data={infosGenerales} />
              <AfficherMesure
                title="Mesure nourrisson"
                type="nourrisson"
                poids={visite.poids_bebe}
                taille={visite.taille_bebe}
                muac={visite.muac_bebe}
              />
              <div className="flex gap-3">
                <ZScoreBox label="P/A" value={visite.score_z_pa} />
                <ZScoreBox label="T/A" value={visite.score_z_ta} />
                <ZScoreBox label="P/T" value={visite.score_z_pt} />
              </div>
              <InfoCard
                title="Observations cliniques nourrisson"
                text={visite.observations_cliniques_bebe || "-"}
              />
              <ActionButtons className="mt-6 grid grid-cols-2 gap-4 w-full" />
            </div>

            <div className="space-y-3">
              <StatutCalculeBlock />
              <AfficherMesure
                title="Mesure mère"
                type="mere"
                poids={visite.poids_mere}
                taille={visite.taille_mere}
                muac={visite.muac_mere}
                hemoglobine={visite.hemoglobine}
              />
              <AfficherMesure
                title="Informations complémentaires"
                variant="complement"
                statutImc={visite.statut_imc}
                hemoglobineStatut={visite.statut_hemoglobine}
              />
              <InfoCard
                title="Observations cliniques mère"
                text={visite.observations_cliniques_mere || "-"}
              />
              <InfoCard
                title="Évaluation visuelle de la situation familiale"
                text={visite.evaluation_famille || "-"}
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex sm:hidden flex-col gap-4 mt-4">
            <InfoCard title="Informations générales" data={infosGenerales} />
            <StatutCalculeBlock />
            <AfficherMesure
              title="Mesure nourrisson"
              type="nourrisson"
              poids={visite.poids_bebe}
              taille={visite.taille_bebe}
              muac={visite.muac_bebe}
            />
            <div className="flex gap-3">
              <ZScoreBox label="P/A" value={visite.score_z_pa} />
              <ZScoreBox label="T/A" value={visite.score_z_ta} />
              <ZScoreBox label="P/T" value={visite.score_z_pt} />
            </div>
            <InfoCard
              title="Observations cliniques nourrisson"
              text={visite.observations_cliniques_bebe || "-"}
            />
            <AfficherMesure
              title="Mesure mère"
              type="mere"
              poids={visite.poids_mere}
              taille={visite.taille_mere}
              muac={visite.muac_mere}
              hemoglobine={visite.hemoglobine}
            />
            <AfficherMesure
              title="Informations complémentaires"
              variant="complement"
              statutImc={visite.statut_imc}
              hemoglobineStatut={visite.statut_hemoglobine}
            />
            <InfoCard
              title="Observations cliniques mère"
              text={visite.observations_cliniques_mere || "-"}
            />
            <InfoCard
              title="Évaluation visuelle de la situation familiale"
              text={visite.evaluation_famille || "-"}
            />
            <ActionButtons className="mt-2 grid grid-cols-1 gap-3 w-full" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailVisite;
