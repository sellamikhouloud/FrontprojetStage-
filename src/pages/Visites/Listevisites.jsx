import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardVisiteListe from "../../components/Cards/Cardvisiteliste";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";
import PopupDetailVisite from "../../components/Popups/Popupdetailsvisite";
import PopupDetailVisiteModifier from "../../components/Popups/PopupdetailvisiteModifier";

import { listVisites, getVisite, annulerVisite } from "../../lib/api/visites";

const getBadgeBebe = (statut) => {
  switch (statut) {
    case "mam":
      return { type: "mam", text: "MAM nourrisson" };
    case "mas":
      return { type: "mas", text: "MAS nourrisson" };
    case "normale":
      return { type: "mere", text: "Bébé normal" };
    default:
      return null;
  }
};

const getBadgeMere = (statut) => {
  switch (statut) {
    case "normale":
      return { type: "mere", text: "Mère normale" };
    case "a_risque":
      return { type: "risque", text: "Mère à risque" };
    case "malnutrition":
      return { type: "mas", text: "Mère malnutrie" };
    default:
      return null;
  }
};

export default function ListeVisites() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [selectedVisite, setSelectedVisite] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);

  const {
    data: visites = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["visites", search],

    queryFn: async () => {
      const params = {};

      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      const response = await listVisites(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.results)) {
        return data.results;
      }

      return [];
    },

    keepPreviousData: true,
    retry: 1,
  });

  
  const buildFamilleFromVisite = (item) => ({
    id: item.famille ?? "-",
    nourrisson: item.nourrisson ?? null,
    mere: item.mere
      ? {
          nom: item.mere?.nom ?? "",
          prenom: item.mere?.prenom ?? "",
          village: item.mere?.village ?? null,
        }
      : null,
  });

  // 🔑 Suppression / annulation réelle de la visite
  const handleDeleteVisite = async (visite) => {
    try {
      await annulerVisite(visite.id);

      setShowDetailPopup(false);
      setSelectedVisite(null);

      await queryClient.invalidateQueries({ queryKey: ["visites"] });
    } catch (err) {
      console.error(
        "Erreur lors de la suppression de la visite :",
        err?.response?.data || err
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">

        <NavigationHeader
          title="Liste des visites"
          secondType="add"
          secondActionTitle="Ajouter une visite"
          onSecondAction={() => navigate("/ajout-visite")}
        />

        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            showFilter={false}
            maxWidth="max-w-full"
            placeholder="Entrer ici pour chercher"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10 md:py-20">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex justify-center py-10 md:py-20">
            <p className="text-red-500">
              {error?.response?.data?.detail ||
                "Impossible de charger la liste des visites."}
            </p>
          </div>
        )}

        {!isLoading && !isError && visites.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {!isLoading && !isError && visites.length > 0 && (
          <div className="space-y-3">
            {visites.map((item) => {
             const nom = `${item.mere?.nom || ""} ${item.mere?.prenom || ""}`.trim() || "-";
              const dateVisite = item.date_visite
                ? new Date(item.date_visite).toLocaleDateString("fr-FR")
                : "-";

              const badgeBebe = getBadgeBebe(item.statut_nutritionnel);
              const badgeMere = getBadgeMere(item.statut_nutritionnel_mere);

              return (
                <CardVisiteListe
                  key={item.id}
                  nom={nom}
                  code={item.code || null}
                  visite={`Visite ${(item.numero_visite ?? 0) + 1}`}
                  date={dateVisite}
                  poids={item.poids_bebe ?? "-"}
                  taille={item.taille_bebe ?? "-"}
                  badgeBebe={badgeBebe}
                  badgeMere={badgeMere}
                  onClick={() => {
                    setSelectedVisite(item);
                    setShowDetailPopup(true);
                  }}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Popup détail visite */}
      <PopupDetailVisite
        open={showDetailPopup}
        visite={selectedVisite}
        famille={selectedVisite ? buildFamilleFromVisite(selectedVisite) : null}
        onClose={() => setShowDetailPopup(false)}
        onEdit={(visite) => {
          setShowDetailPopup(false);
          setSelectedVisite(visite);
          setOpenModifier(true);
        }}
        onDelete={handleDeleteVisite}
      />

      {/* Popup modifier visite */}
      <PopupDetailVisiteModifier
        open={openModifier}
        visite={selectedVisite}
        famille={selectedVisite ? buildFamilleFromVisite(selectedVisite) : null}
        onClose={() => {
          setOpenModifier(false);
          setShowDetailPopup(true);
        }}
        onSave={async (updated) => {
        
          let finalVisite = { ...selectedVisite, ...updated };

          try {
          
            const response = await getVisite(finalVisite.id);
            finalVisite = response?.data ?? finalVisite;
          } catch (err) {
            console.error(
              "Erreur lors du rechargement de la visite :",
              err.response?.data || err
            );
          }

          setSelectedVisite(finalVisite);
          setOpenModifier(false);
          setShowDetailPopup(true);

          queryClient.invalidateQueries({ queryKey: ["visites"] });
        }}
      />
    </div>
  );
}

