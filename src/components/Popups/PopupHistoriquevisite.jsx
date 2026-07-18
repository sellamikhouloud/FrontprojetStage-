import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";

import SearchBar from "../Filter/Searchbar";
import CardPopupvisite from "../cardvisite";

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
        <div
          className="
            fixed
            inset-0
            z-50

            bg-white

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
            className="
              w-full

              min-h-screen
              sm:min-h-0

              sm:max-w-[560px]

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl
            "
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5">
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
                  sm:text-[24px]

                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Historique des visites
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
                px-5
                sm:px-6

                pb-6

                mt-5

                flex-1

                max-h-none
                sm:max-h-[500px]

                overflow-y-auto

                space-y-4
              "
            >
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

export default Popuphistoriquevisite;
