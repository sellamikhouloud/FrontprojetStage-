import Card from "../Cards/Card";
import StatusBadge from "../Cards/Badge";
import InfoCard from "../Containers/AfficherContainer";
import ModifierMesure from "../Containers/ModifierMesure";
import TextareaModifier from "../Containers/TextAreaModifier";
import Button from "../Button/Button";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";

import SuccessBanner from "./SuccessBanner";

const PopupDetailVisiteModifier = ({
  open,
  onClose,
  visite,
  onEdit,
  famille,
}) => {
 

  const [observationNourrisson, setObservationNourrisson] =
    useState("");

  const [observationMere, setObservationMere] =
    useState("");

  const [evaluationFamiliale, setEvaluationFamiliale] =
    useState("");


  const [poidsNourrisson, setPoidsNourrisson] =
    useState("");

  const [tailleNourrisson, setTailleNourrisson] =
    useState("");

  const [muacNourrisson, setMuacNourrisson] =
    useState("");


  const [poidsMere, setPoidsMere] =
    useState("");

  const [tailleMere, setTailleMere] =
    useState("");

  const [muacMere, setMuacMere] =
    useState("");


  const [statutImc, setStatutImc] =
    useState("");

  const [hemoglobine, setHemoglobine] =
    useState("");

  const [showBanner, setShowBanner] =
    useState(false);


  useEffect(() => {
    if (!visite) return;

    
    setPoidsNourrisson(
      visite.poids_bebe ??
      ""
    );

    setTailleNourrisson(
      visite.taille_bebe ??
      ""
    );

    setMuacNourrisson(
      visite.muac_bebe ??
      ""
    );


    setPoidsMere(
      visite.poids_mere ??
      ""
    );

    setTailleMere(
      visite.taille_mere ??
      ""
    );

    setMuacMere(
      visite.muac_mere ??
      ""
    );

    

    setStatutImc(
      visite.statut_imc ??
      ""
    );

    setHemoglobine(
      visite.hemoglobine ??
      ""
    );


    setObservationNourrisson(
      visite.observations_cliniques_bebe ??
      ""
    );

    setObservationMere(
      visite.observations_cliniques_mere ??
      ""
    );

    setEvaluationFamiliale(
      visite.evaluation_famille ??
      ""
    );

  }, [visite]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR");
  };



  const handleSave = () => {

    const updatedVisite = {
      ...visite,

      poids_bebe: poidsNourrisson,
      taille_bebe: tailleNourrisson,
      muac_bebe: muacNourrisson,

      poids_mere: poidsMere,
      taille_mere: tailleMere,
      muac_mere: muacMere,

      statut_imc: statutImc,
      hemoglobine: hemoglobine,

      observations_cliniques_bebe: observationNourrisson,
      observations_cliniques_mere: observationMere,
      evaluation_famille: evaluationFamiliale,
    };

    onEdit?.(updatedVisite);

    setShowBanner(true);

    setTimeout(() => {
      setShowBanner(false);
      onClose();
    }, 1500);
  };

  if (!open || !visite) return null;


  const enfant =
    famille?.nourrisson?.prenom ||
    "-";

  const mere =
    `${famille?.mere?.nom ?? ""} ${famille?.mere?.prenom ?? ""}`.trim() ||
    "-";

 const sexe =
  famille?.nourrisson?.sexe === "M"
    ? "Fils"
    : famille?.nourrisson?.sexe === "F"
    ? "Fille"
    : "-";

  const region =
    famille?.mere?.village?.nom ||
    "-";

  const dateNaissance =
    famille?.nourrisson?.date_naissance ||
    "-";

  const code =
    famille?.id ||
    "-";


  const numeroVisite =
    visite.numero_visite !== undefined &&
    visite.numero_visite !== null
      ? visite.numero_visite + 1
      : "-";

  

  const dateVisite =
    formatDate(visite.date_visite);


  const dateEnregistrement =
    formatDate(visite.date_creation);


  const infosGenerales = [
    {
      label: "Date",
      value: dateVisite,
    },
    {
      label: "Visite n°",
      value: numeroVisite,
    },
    {
      label: "Enregistrée par",
      value:
        visite.audit?.cree_par
          ? `${visite.audit.cree_par.nom} ${visite.audit.cree_par.prenom}`
          : "-",
    },
    {
      label: "Date d'enregistrement",
      value: dateEnregistrement,
    },
    {
      label: "Modifié par",
      value:
        visite.audit?.modifie_par
          ? `${visite.audit.modifie_par.nom} ${visite.audit.modifie_par.prenom}`
          : "-",
    },
    {
      label: "Date de modification",
      value: formatDate(visite.date_modification),
    },
  ];

  // =====================================================
  // STATUT CALCULÉ
  // =====================================================
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
    text: "Bébé normal",
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
      <h3
        className="
          text-[18px]
          font-semibold
          text-center
          text-[#202124]
          mb-3
        "
      >
        Statut calculé
      </h3>

      <div
        className="
          flex
          flex-wrap
          sm:flex-nowrap
          justify-center
          items-center
          gap-3
        "
      >
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

  const SaveButtonBlock = () => (
    <div className="w-full">
      {showBanner && (
        <SuccessBanner text="Enregistré avec succès" />
      )}

      <Button
        title="Enregistrer"
        variant="primary"
        icon={EditIcon}
        noWrapperPadding
        onClick={handleSave}
      />
    </div>
  );


  return (
    <AnimatePresence>
      <div
        className="
          fixed
          inset-0
          z-[70]

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

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          exit={{
            opacity: 0,
            scale: 0.96,
          }}

          transition={{
            duration: 0.2,
          }}

          onClick={(e) =>
            e.stopPropagation()
          }

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

          style={{
            borderColor: "#4E9F8A",
          }}
        >

        

          <div className="mb-4">

            <button
              onClick={onClose}
              className="
                flex
                items-center
                gap-2
                text-[17px]
                text-[#202124]
                hover:opacity-70
                transition
              "
            >
              <img
                src={quitter}
                alt="Fermer"
                className="w-5 h-5"
              />

              Annuler
            </button>

            <h2
              className="
                mt-3
                text-center
                text-[20px]
                font-bold
                text-[#202124]
              "
            >
              Détail de la visite n{numeroVisite}
            </h2>

          </div>

        

          <Card
           mere={mere}
            enfant={enfant}
            sexe={sexe}
            region={region}
            naissance={dateNaissance}
            code={code}
            badges={[]}
          />

        

          <div className="hidden sm:grid sm:grid-cols-2 gap-4 mt-4">


            <div className="space-y-3">

              <InfoCard
                title="Informations générales"
                data={infosGenerales}
              />

              <ModifierMesure
                title="Mesure nourrisson"

                poids={poidsNourrisson}
                taille={tailleNourrisson}
                muac={muacNourrisson}

                setPoids={setPoidsNourrisson}
                setTaille={setTailleNourrisson}
                setMuac={setMuacNourrisson}
              />

              <TextareaModifier
                label="Observations cliniques nourrisson"
                value={observationNourrisson}
                onChange={(e) =>
                  setObservationNourrisson(e.target.value)
                }
                height="h-[100px]"
              />

              <div className="mt-4">
                <SaveButtonBlock />
              </div>

            </div>

            {/* COLONNE DROITE */}

            <div className="space-y-3">

              <StatutCalculeBlock />

              <ModifierMesure
                title="Mesure mère"

                poids={poidsMere}
                taille={tailleMere}
                muac={muacMere}

                setPoids={setPoidsMere}
                setTaille={setTailleMere}
                setMuac={setMuacMere}
              />

              <ModifierMesure
                title="Informations complémentaires"
                variant="complement"

                statutImc={statutImc}
                hemoglobine={hemoglobine}

                setStatutImc={setStatutImc}
                setHemoglobine={setHemoglobine}
              />

              <TextareaModifier
                label="Observations cliniques mère"
                value={observationMere}
                onChange={(e) =>
                  setObservationMere(e.target.value)
                }
                height="h-[100px]"
              />

              <TextareaModifier
                label="Évaluation visuelle de la situation familiale"
                value={evaluationFamiliale}
                onChange={(e) =>
                  setEvaluationFamiliale(e.target.value)
                }
                height="h-[100px]"
              />

            </div>

          </div>


          <div className="flex sm:hidden flex-col gap-4 mt-4">

            <InfoCard
              title="Informations générales"
              data={infosGenerales}
            />

            <StatutCalculeBlock />

            <ModifierMesure
              title="Mesure nourrisson"

              poids={poidsNourrisson}
              taille={tailleNourrisson}
              muac={muacNourrisson}

              setPoids={setPoidsNourrisson}
              setTaille={setTailleNourrisson}
              setMuac={setMuacNourrisson}
            />

            <TextareaModifier
              label="Observations cliniques nourrisson"
              value={observationNourrisson}
              onChange={(e) =>
                setObservationNourrisson(e.target.value)
              }
              height="h-[55px]"
            />

            <ModifierMesure
              title="Mesure mère"

              poids={poidsMere}
              taille={tailleMere}
              muac={muacMere}

              setPoids={setPoidsMere}
              setTaille={setTailleMere}
              setMuac={setMuacMere}
            />

            <ModifierMesure
              title="Informations complémentaires"
              variant="complement"

              statutImc={statutImc}
              hemoglobine={hemoglobine}

              setStatutImc={setStatutImc}
              setHemoglobine={setHemoglobine}
            />

            <TextareaModifier
              label="Observations cliniques mère"
              value={observationMere}
              onChange={(e) =>
                setObservationMere(e.target.value)
              }
              height="h-[55px]"
            />

            <TextareaModifier
              label="Évaluation visuelle de la situation familiale"
              value={evaluationFamiliale}
              onChange={(e) =>
                setEvaluationFamiliale(e.target.value)
              }
              height="h-[55px]"
            />

            <div className="mt-2">
              <SaveButtonBlock />
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default PopupDetailVisiteModifier;
