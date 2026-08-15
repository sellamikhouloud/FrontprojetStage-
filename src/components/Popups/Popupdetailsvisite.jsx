import Card from "../Cards/Card";
import StatusBadge from "../Cards/Badge";
import InfoCard from "../Containers/AfficherContainer";
import AfficherMesure from "../Containers/AfficherMesure";
import Button from "../Button/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";
import PopupDetailVisiteModifier from "./PopupdetailvisiteModifier";
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

  if (!open || !visite) return null;

  // Contenu réutilisé dans les deux layouts
  const infosGenerales = [
   {
  label: "Date",
  value: visite.date_visite
    ? new Date(visite.date_visite).toLocaleDateString("fr-FR")
    : "-",
},
    { label: "Visite n°", value: (visite.numero_visite ?? -1) + 1 },
    {
      label: "Enregistrée par",
      value: visite.audit?.cree_par
        ? `${visite.audit.cree_par.nom} ${visite.audit.cree_par.prenom}`
        : "-",
    },
 {
      label: "Date d'enregistrement",
      value: visite.date_creation
        ? new Date(visite.date_creation).toLocaleDateString("fr-FR")
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
      value: visite.date_modification
        ? new Date(visite.date_modification).toLocaleDateString("fr-FR")
        : "-",
    },
  ];

  const statutBadges = [
    (visite?.statut_nutritionnel === "mam" ||
      visite?.statut_nutritionnel === "Malnutrition Aiguë Modérée") && {
      type: "mam",
      text: "MAM nourrisson",
    },
    (visite?.statut_nutritionnel === "mas" ||
      visite?.statut_nutritionnel === "Malnutrition Aiguë Sévère") && {
      type: "mas",
      text: "MAS nourrisson",
    },
    (visite?.statut_nutritionnel === "normale" ||
      visite?.statut_nutritionnel === "Normale") && {
      type: "mere",
      text: "Bébé normal",
    },
    (visite?.statut_nutritionnel_mere === "normale" ||
      visite?.statut_nutritionnel_mere === "Normale") && {
      type: "mere",
      text: "Mère normale",
    },
    (visite?.statut_nutritionnel_mere === "a_risque" ||
      visite?.statut_nutritionnel_mere === "À risque") && {
      type: "risque",
      text: "Mère à risque",
    },
    (visite?.statut_nutritionnel_mere === "malnutrition" ||
      visite?.statut_nutritionnel_mere === "Malnutrition") && {
      type: "mas",
      text: "Mère malnutrie",
    },
  ].filter(Boolean);

  const StatutCalculeBlock = () => (
    <div
      className="
        w-full
        rounded-[20px]
        border
        border-[#E6ECEA]
        bg-[#F8FBFC]
        px-[15px]
        py-3
        flex
        flex-col
      "
    >
      <h3 className="text-[18px] font-semibold text-center text-[#202124] mb-3">
        Statut calculé
      </h3>

      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3">
        {statutBadges.map((badge, index) => (
          <StatusBadge
            key={`${badge.type}-${index}`}
            type={badge.type}
            text={badge.text}
            className="
              h-[44px]
              sm:h-[50px]
              flex-1
              sm:flex-none
              min-w-0
              sm:min-w-[190px]
              rounded-[18px]
              text-[14px]
              sm:text-[16px]
              font-semibold
              px-4
              sm:px-6
            "
          />
        ))}
      </div>
    </div>
  );

  const ActionButtons = ({ className }) => (
    <div className={className}>
      <Button
        title="Modifier"
        variant="modifier"
        icon={EditIcon}
        noWrapperPadding
        onClick={() => onEdit?.(visite)}
      />
      <Button
        title="Supprimer"
        variant="supprimer"
        icon={DeleteIcon}
        noWrapperPadding
        onClick={() => setShowDeletePopup(true)}
      />
    </div>
  );

  return (
    <AnimatePresence>
      <div
        className="
          fixed
          inset-0
          z-[60]
          bg-transparent
          sm:bg-black/40
          flex
          items-start
          sm:items-center
          justify-center
          overflow-y-auto
          scrollbar-hide
        "
        onClick={onClose}
      >
        {showDeletePopup && (
          <div onClick={(e) => e.stopPropagation()}>
            <Popup
              title="Confirmer la suppression"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir supprimer cette visite ? Cette action est irréversible."
              primaryButtonText="Supprimer"
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={() => {
                setShowDeletePopup(false);
                onDelete?.(visite);
              }}
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
          className="
            w-full
            min-h-screen
            sm:min-h-0
            sm:w-[952px]
            sm:max-h-[90vh]
            overflow-y-auto
            scrollbar-hide
            bg-white
            rounded-none
            sm:rounded-[20px]
            border-0
            sm:border
            p-4
            sm:p-6
          "
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
              Détail de la visite {(visite.numero_visite ?? -1) + 1}
            </h2>
          </div>

          {/* Carte famille */}
          <Card
            enfant={famille?.nourrisson?.prenom}
            mere={`${famille?.mere?.prenom ?? ""} ${famille?.mere?.nom ?? ""}`}
            sexe={
              famille?.nourrisson?.sexe === "M" ||
              famille?.nourrisson?.sexe === "Masculin"
                ? "Fils"
                : famille?.nourrisson?.sexe === "F" ||
                  famille?.nourrisson?.sexe === "Féminin"
                ? "Fille"
                : "-"
            }
            region={famille?.mere?.village?.nom ?? "-"}
            naissance={famille?.nourrisson?.date_naissance ?? "-"}
            code={famille?.id ?? "-"}
            badges={[]}
          />

          {/* ==================== DESKTOP (inchangé) ==================== */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 mt-4">
            {/* Gauche */}
            <div className="space-y-3">
              <InfoCard title="Informations générales" data={infosGenerales} />

              <AfficherMesure
                title="Mesure nourrisson"
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

            {/* Droite */}
            <div className="space-y-3">
              <StatutCalculeBlock />

              <AfficherMesure
                title="Mesure mère"
                poids={visite.poids_mere}
                taille={visite.taille_mere}
                muac={visite.muac_mere}
              />


<AfficherMesure
  title="Informations complémentaires"
  variant="complement"
  statutImc={visite.statut_imc}
  hemoglobine={visite.hemoglobine}
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

          {/* ==================== MOBILE (nouvel ordre) ==================== */}
          <div className="flex sm:hidden flex-col gap-4 mt-4">
            <InfoCard title="Informations générales" data={infosGenerales} />

            <StatutCalculeBlock />

            <AfficherMesure
              title="Mesure nourrisson"
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
              poids={visite.poids_mere}
              taille={visite.taille_mere}
              muac={visite.muac_mere}
            />


<AfficherMesure
  title="Informations complémentaires"
  variant="complement"
  statutImc={visite.statut_imc}
  hemoglobine={visite.hemoglobine}
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
