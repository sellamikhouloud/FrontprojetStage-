import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardCoordinateur from "../../components/Cards/carteCoordinateur";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NoResultImage from "../../assets/no result picture.svg";
import { listCoordinateurs } from "../../lib/api/coordinateurs";

export default function ListeCoordinateurs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [coordinateurs, setCoordinateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chargement de la liste réelle des coordinateurs depuis l'API.
  // On ne filtre PAS sur le statut ici : on affiche Actifs ET Inactifs,
  // exactement comme dans la popup PopupListeCoordinateurs (PhotoConfirmation.jsx).
  useEffect(() => {
    let cancelled = false;

    const fetchCoordinateurs = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await listCoordinateurs();

        const mapped = data.map((c) => ({
          id: c.id,
          name: `${c.prenom} ${c.nom}`,
          code: c.id,
          village: c.village?.nom || "",
          familles: c.nb_familles ?? 0,
          status: c.is_active ? "Actif" : "Inactif",
        }));

        if (!cancelled) {
          setCoordinateurs(mapped);
        }
      } catch (err) {
        console.error(
          "Erreur lors du chargement des coordinateurs :",
          err.response?.data || err.message
        );
        if (!cancelled) {
          setError("Impossible de charger la liste des coordinateurs.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCoordinateurs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCoordinateurs = coordinateurs.filter((item) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      item.name.toLowerCase().includes(keyword) ||
      String(item.code).toLowerCase().includes(keyword) ||
      item.village.toLowerCase().includes(keyword) ||
      item.familles.toString().includes(keyword) ||
      item.status.toLowerCase() === keyword
    );
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
       
        <NavigationHeader
          title="Liste des coordinateurs"
          type="share"
          actionTitle="Exporter la liste des coordinateurs"
          onAction={() => {
            // Fonction d'export
          }}
          secondType="add"
          secondActionTitle="Ajouter un coordinateur"
          onSecondAction={() => navigate("/ajout-coordinateur")}
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

        {loading && (
          <div className="flex-1 flex items-center justify-center py-10 md:py-20">
            <p className="text-gray-500">Chargement des coordinateurs...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center py-10 md:py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && filteredCoordinateurs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {!loading && !error && filteredCoordinateurs.length > 0 && (
          <div className="space-y-3">
            {filteredCoordinateurs.map((coordinateur) => (
              <div
                key={coordinateur.id}
                onClick={() => navigate(`/fiche-coordinateur/${coordinateur.id}`)}
                className="cursor-pointer"
              >
                <CardCoordinateur
                  name={coordinateur.name}
                  village={coordinateur.village}
                  familles={coordinateur.familles}
                  code={coordinateur.code}
                  status={coordinateur.status}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
