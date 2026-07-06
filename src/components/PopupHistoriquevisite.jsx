import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";

import SearchBar from "./SearchBar";
import CardPopupvisite from "./cardvisite";

const Popuphistoriquevisite = ({
  open,
  onClose,
  Visites = [],
}) => {
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
    if (!search.trim()) return Visites;

    const value = search.toLowerCase();

    return Visites.filter(
      (item) =>
        item.enfant.toLowerCase().includes(value) ||
        item.code.toLowerCase().includes(value)
    );
  }, [search, Visites]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="
              w-full
              max-w-[560px]
              bg-white
              rounded-[18px]
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="px-6 pt-5">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[17px] hover:opacity-70"
              >
                <img
                  src={quitter}
                  alt=""
                  className="w-5 h-5"
                />

                Fermer
              </button>

              <h2 className="mt-4 text-[22px] font-bold text-[#1E1E1E]">
                Historique des visites
              </h2>

              {/* Recherche */}
<div className="mt-4">
  <SearchBar
    placeholder="Cherchez ici"
    width="w-full"
    maxWidth="max-w-none"
    showFilter={false}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
            </div>

            {/* Cartes */}

            <div className="px-6 pb-6 mt-4 max-h-[500px] overflow-y-auto space-y-4">
              {data.length ? (
                data.map((item) => (
                  <CardPopupvisite
                    key={item.id}
                    enfant={item.enfant}
                    code={item.code}
                    visite={item.visite}
                    date={item.date}
                    poids={item.poids}
                    taille={item.taille}
                    badges={item.badges}
                    onClick={() => console.log(item)}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  Aucun résultat.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popuphistoriquevisite ;
