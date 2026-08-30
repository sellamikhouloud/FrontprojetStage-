import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import Spinner from "../Spinner";
import SearchBar from "../Filter/Searchbar";
import CardCoordinateur from "../Cards/carteCoordinateur";

const PopupListeCoordinateurs = ({
  open,
  onClose,
  coordinateurs = [],
  onSelectCoordinateur,
  loading,
  isError,
  search,
  onSearchChange,
  observerTarget,
  isFetchingNextPage,
}) => {
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
                Liste des coordinateurs
              </h2>

              <div className="mt-5">
                <SearchBar
                  placeholder="Cherchez ici"
                  width="w-full"
                  maxWidth="max-w-none"
                  showFilter={false}
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>

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
              {loading && (
                <div className="flex justify-center py-6">
                  <Spinner />
                </div>
              )}

              {isError && !loading && (
                <p className="text-center text-red-500 py-6">
                  Impossible de charger les coordinateurs.
                </p>
              )}

              {!loading && !isError && coordinateurs.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Aucun résultat.
                </div>
              )}

              {!loading &&
                !isError &&
                coordinateurs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      onSelectCoordinateur && onSelectCoordinateur(item)
                    }
                    className="cursor-pointer"
                  >
                    <CardCoordinateur
                      name={item.name}
                      code={item.code}
                      village={item.village}
                      familles={item.familles}
                      status={item.status}
                      username={item.username}
                      creePar={item.creePar}
                      isChef={item.isChef}
                    />
                  </div>
                ))}

              {!loading && coordinateurs.length > 0 && (
                <div ref={observerTarget} className="h-1" />
              )}

              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupListeCoordinateurs;
