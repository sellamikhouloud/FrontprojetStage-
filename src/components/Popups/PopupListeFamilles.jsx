import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

import SearchBar from "../Filter/Searchbar";
import CardPopup from "../Cards/Card2";

const PopupListeFamilles = ({
  open,
  onClose,
  familles = [],
  onSelectFamille,
}) => {
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
    if (!search.trim()) return familles;

    const value = search.toLowerCase();

    return familles.filter(
      (item) =>
        item.enfant.toLowerCase().includes(value) ||
        item.code.toLowerCase().includes(value)
    );
  }, [search, familles]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-50

            bg-transparent
            sm:bg-black/40

            flex
            items-start
            sm:items-center
            justify-center

            overflow-y-auto
          "
        >
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
              sm:w-[620px]
              sm:max-h-[90vh]

              overflow-y-auto
              scrollbar-hide

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl

              p-4
              sm:p-6
            "
          >
            {/* Header */}
            <div className="mb-5">
              <button
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-2

                  text-[16px]
                  sm:text-[17px]

                  hover:opacity-70
                  transition
                "
              >
                <img
                  src={quitter}
                  alt="Fermer"
                  className="w-5 h-5"
                />
                Fermer
              </button>

              <h2
                className="
                  mt-5
                  text-center

                  text-[22px]
                  sm:text-[26px]

                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Liste des familles
              </h2>

              {/* Recherche */}
              <div className="mt-5">
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
            <div
              className="
                mt-5

                space-y-4

                sm:max-h-[55vh]
                sm:overflow-y-auto

                scrollbar-hide

                pb-2
                pr-1
              "
            >
              {data.length ? (
                data.map((item) => (
                  <CardPopup
                    key={item.id}
                    enfant={item.enfant}
                    sexe={item.sexe}
                    region={item.region}
                    naissance={item.naissance}
                    code={item.code}
                    badges={item.badges}
                    onClick={() => onSelectFamille && onSelectFamille(item)}
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

export default PopupListeFamilles;