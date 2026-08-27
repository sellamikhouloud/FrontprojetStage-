import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import Edit from "../../assets/Edit 2.svg";

import { Plus, Check, X } from "lucide-react";

import EditStockPopup from "./EditStockPopup";

import {
  CreateProduit,
  ajouterStock,
  modifierSeuil,
} from "../../lib/api/stock";

const StockPopup = ({
  onClose,
  initialProducts = [],
  onSaveProducts,
}) => {
  // =========================================================
  // STATES
  // =========================================================

  const [showEditPopup, setShowEditPopup] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [pendingIndex, setPendingIndex] =
    useState(null);

  const [incrementValue, setIncrementValue] =
    useState("");

  const [backupProducts, setBackupProducts] =
    useState([]);

  const timerRef = useRef(null);

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({
      title: "",
      quantity: 0,
      unit: "Kg",
    });

  const [productError, setProductError] =
    useState("");

  const [isAddingProduct, setIsAddingProduct] =
    useState(false);

  const [isAddingStock, setIsAddingStock] =
    useState(false);

  const [isSavingThresholds, setIsSavingThresholds] =
    useState(false);

  // =========================================================
  // FORMAT QUANTITY
  // =========================================================

  const formatQuantity = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Number(number.toFixed(2));
  };

  // =========================================================
  // BACKEND UNIT -> FRONTEND UNIT
  // =========================================================

  const getDisplayUnit = (unit) => {
    switch (unit) {
      case "kg":
        return "Kg";

      case "litre":
      case "litres":
        return "Litres";

      case "boite":
      case "boîtes":
        return "boîtes";

      case "sac":
      case "sacs":
        return "Sacs";

      case "piece":
      case "pièce":
      case "pieces":
        return "Pièces";

      default:
        return unit || "Kg";
    }
  };

  // =========================================================
  // FRONTEND UNIT -> BACKEND UNIT
  // =========================================================

  const getBackendUnit = (unit) => {
    switch (unit) {
      case "Kg":
        return "kg";

      case "Litres":
        return "litre";

      case "boîtes":
        return "boite";

      case "Sacs":
        return "sac";

      case "Pièces":
        return "piece";

      default:
        return unit?.toLowerCase() || "kg";
    }
  };

  // =========================================================
  // INITIAL PRODUCTS
  // =========================================================

  useEffect(() => {
    const formattedProducts =
      initialProducts.map((product) => ({
        id: product.id,

        title:
          product.title ||
          product.nom ||
          "",

        quantity: formatQuantity(
          product.quantity ??
            product.stock_courant ??
            product.stock_initial ??
            0
        ),

        unit: getDisplayUnit(
          product.unit ||
            product.unite
        ),

        threshold: formatQuantity(
          product.threshold ??
            product.alerte_seuil ??
            1
        ),

        type_produit:
          product.type_produit ||
          "aliment",

        grammage_boite:
          product.grammage_boite ??
          null,
      }));

    setProducts(formattedProducts);
  }, [initialProducts]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // =========================================================
  // SEND PRODUCTS TO PARENT
  // =========================================================

  const saveToDistributionPage = (
    updatedProducts
  ) => {
    onSaveProducts?.(
      updatedProducts.map(
        (product) => ({
          id: product.id,

          nom: product.title,

          quantity: formatQuantity(
            product.quantity
          ),

          unite: getBackendUnit(
            product.unit
          ),

          threshold: formatQuantity(
            product.threshold
          ),
        })
      )
    );
  };

  // =========================================================
  // SAVE THRESHOLDS TO BACKEND
  // =========================================================

  const handleSaveThresholds = async (
    updatedThresholds
  ) => {
    if (
      !Array.isArray(updatedThresholds) ||
      updatedThresholds.length === 0
    ) {
      return;
    }

    setIsSavingThresholds(true);
    setProductError("");

    try {
      console.log(
        "================================"
      );

      console.log(
        "MODIFICATION DES SEUILS"
      );

      console.log(
        "Produits reçus :",
        updatedThresholds
      );

      console.log(
        "================================"
      );

      // -------------------------------------------------------
      // UPDATE EVERY PRODUCT
      // -------------------------------------------------------

      const updatedProducts =
        [...products];

      for (
        const editedProduct
        of updatedThresholds
      ) {
        if (!editedProduct?.id) {
          console.warn(
            "Produit sans ID :",
            editedProduct
          );

          continue;
        }

        const newThreshold =
          Number(
            editedProduct.threshold
          );

        if (
          Number.isNaN(newThreshold) ||
          newThreshold < 0
        ) {
          throw new Error(
            `Seuil invalide pour le produit ${editedProduct.title}`
          );
        }

        const currentProduct =
          products.find(
            (product) =>
              product.id ===
              editedProduct.id
          );

        if (!currentProduct) {
          continue;
        }

        // -----------------------------------------------------
        // ONLY CALL API IF VALUE CHANGED
        // -----------------------------------------------------

        if (
          Number(
            currentProduct.threshold
          ) !== newThreshold
        ) {
          const payload = {
            alerte_seuil:
              newThreshold,
          };

          console.log(
            "================================"
          );

          console.log(
            "MODIFICATION SEUIL"
          );

          console.log(
            "Produit ID :",
            editedProduct.id
          );

          console.log(
            "Ancien seuil :",
            currentProduct.threshold
          );

          console.log(
            "Nouveau seuil :",
            newThreshold
          );

          console.log(
            "Payload :",
            payload
          );

          console.log(
            "================================"
          );

          // ---------------------------------------------------
          // BACKEND REQUEST
          // ---------------------------------------------------

          const response =
            await modifierSeuil(
              editedProduct.id,
              payload
            );

          console.log(
            "Réponse modification seuil :",
            response?.data
          );

          const backendProduct =
            response?.data;

          // ---------------------------------------------------
          // UPDATE LOCAL PRODUCT
          // ---------------------------------------------------

          const productIndex =
            updatedProducts.findIndex(
              (product) =>
                product.id ===
                editedProduct.id
            );

          if (
            productIndex !== -1
          ) {
            updatedProducts[
              productIndex
            ] = {
              ...updatedProducts[
                productIndex
              ],

              threshold:
                formatQuantity(
                  backendProduct?.alerte_seuil ??
                    newThreshold
                ),
            };
          }
        }
      }

      // =======================================================
      // UPDATE FRONTEND
      // =======================================================

      setProducts(
        updatedProducts
      );

      // =======================================================
      // SEND UPDATED PRODUCTS TO PARENT
      // =======================================================

      saveToDistributionPage(
        updatedProducts
      );

      // =======================================================
      // CLOSE POPUP
      // =======================================================

      setShowEditPopup(false);

      console.log(
        "Tous les seuils ont été sauvegardés."
      );
    } catch (error) {
      console.error(
        "Erreur lors de la modification des seuils :",
        error
      );

      // =======================================================
      // BACKEND ERROR
      // =======================================================

      if (error?.response?.data) {
        const backendError =
          error.response.data;

        if (
          typeof backendError ===
          "string"
        ) {
          setProductError(
            backendError
          );
        } else if (
          backendError.detail
        ) {
          setProductError(
            backendError.detail
          );
        } else {
          const firstError =
            Object.values(
              backendError
            )[0];

          if (
            Array.isArray(
              firstError
            )
          ) {
            setProductError(
              firstError[0]
            );
          } else if (
            typeof firstError ===
            "string"
          ) {
            setProductError(
              firstError
            );
          } else {
            setProductError(
              "Impossible de modifier le seuil."
            );
          }
        }
      } else {
        setProductError(
          error?.message ||
            "Une erreur est survenue lors de la modification du seuil."
        );
      }
    } finally {
      setIsSavingThresholds(false);
    }
  };

  // =========================================================
  // START INCREMENT
  // =========================================================

  const handleIncrement = (
    index
  ) => {
    if (timerRef.current) {
      clearTimeout(
        timerRef.current
      );
    }

    setProductError("");

    setBackupProducts([
      ...products,
    ]);

    setPendingIndex(index);
    setIncrementValue("");
  };

  // =========================================================
  // CONFIRM INCREMENT
  // =========================================================

  const handleConfirm = async () => {
    if (
      incrementValue === "" ||
      Number(incrementValue) <= 0
    ) {
      setProductError(
        "Veuillez saisir une quantité valide."
      );

      return;
    }

    if (pendingIndex === null) {
      return;
    }

    const product =
      products[pendingIndex];

    if (!product?.id) {
      setProductError(
        "Impossible de modifier ce produit : identifiant manquant."
      );

      return;
    }

    setProductError("");
    setIsAddingStock(true);

    try {
      const quantityToAdd =
        Number(
          incrementValue
        );

      const payload = {
        quantite:
          String(
            quantityToAdd
          ),
      };

      console.log(
        "================================"
      );

      console.log(
        "AJOUT DE STOCK"
      );

      console.log(
        "Produit ID :",
        product.id
      );

      console.log(
        "Payload :",
        payload
      );

      console.log(
        "================================"
      );

      const response =
        await ajouterStock(
          product.id,
          payload
        );

      const updatedProduct =
        response?.data;

      console.log(
        "Réponse ajout stock :",
        updatedProduct
      );

      const updatedProducts =
        products.map(
          (
            currentProduct,
            index
          ) => {
            if (
              index !==
              pendingIndex
            ) {
              return currentProduct;
            }

            return {
              ...currentProduct,

              id:
                updatedProduct?.id ??
                currentProduct.id,

              title:
                updatedProduct?.nom ??
                currentProduct.title,

              quantity:
                formatQuantity(
                  updatedProduct?.stock_courant ??
                    Number(
                      currentProduct.quantity
                    ) +
                      quantityToAdd
                ),

              unit:
                getDisplayUnit(
                  updatedProduct?.unite ??
                    currentProduct.unit
                ),

              threshold:
                formatQuantity(
                  updatedProduct?.alerte_seuil ??
                    currentProduct.threshold
                ),

              type_produit:
                updatedProduct?.type_produit ??
                currentProduct.type_produit,

              grammage_boite:
                updatedProduct?.grammage_boite ??
                currentProduct.grammage_boite,
            };
          }
        );

      setProducts(
        updatedProducts
      );

      saveToDistributionPage(
        updatedProducts
      );

      setPendingIndex(null);
      setIncrementValue("");
      setBackupProducts([]);
      setProductError("");
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du stock :",
        error
      );

      if (
        error?.response?.data
      ) {
        const backendError =
          error.response.data;

        if (
          typeof backendError ===
          "string"
        ) {
          setProductError(
            backendError
          );
        } else if (
          backendError.detail
        ) {
          setProductError(
            backendError.detail
          );
        } else {
          const firstError =
            Object.values(
              backendError
            )[0];

          if (
            Array.isArray(
              firstError
            )
          ) {
            setProductError(
              firstError[0]
            );
          } else if (
            typeof firstError ===
            "string"
          ) {
            setProductError(
              firstError
            );
          } else {
            setProductError(
              "Impossible d'ajouter le stock."
            );
          }
        }
      } else {
        setProductError(
          "Une erreur est survenue. Vérifiez la connexion au serveur."
        );
      }
    } finally {
      setIsAddingStock(false);
    }
  };

  // =========================================================
  // CANCEL INCREMENT
  // =========================================================

  const handleCancel = () => {
    setProducts(
      backupProducts
    );

    setPendingIndex(null);
    setIncrementValue("");
    setProductError("");
    setBackupProducts([]);
  };

  // =========================================================
  // OPEN ADD PRODUCT
  // =========================================================

  const handleOpenAddProduct =
    () => {
      setProductError("");

      setNewProduct({
        title: "",
        quantity: 0,
        unit: "Kg",
      });

      setShowAddProduct(
        true
      );
    };

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const handleAddProduct =
    async () => {
      const title =
        newProduct.title.trim();

      if (!title) {
        setProductError(
          "Veuillez saisir le nom du produit."
        );

        return;
      }

      const quantity =
        Number(
          newProduct.quantity
        );

      if (
        newProduct.quantity ===
          "" ||
        Number.isNaN(quantity) ||
        quantity < 0
      ) {
        setProductError(
          "Veuillez saisir une quantité valide."
        );

        return;
      }

      const alreadyExists =
        products.some(
          (product) =>
            product.title
              ?.trim()
              .toLowerCase() ===
            title.toLowerCase()
        );

      if (alreadyExists) {
        setProductError(
          "Ce produit existe déjà."
        );

        return;
      }

      setProductError("");
      setIsAddingProduct(
        true
      );

      try {
        const payload = {
          nom: title,

          type_produit:
            "aliment",

          unite:
            getBackendUnit(
              newProduct.unit
            ),

          stock_initial:
            String(quantity),

          stock_courant:
            String(quantity),

          alerte_seuil:
            "1",
        };

        console.log(
          "================================"
        );

        console.log(
          "CRÉATION PRODUIT"
        );

        console.log(
          "Payload :",
          payload
        );

        console.log(
          "================================"
        );

        const response =
          await CreateProduit(
            payload
          );

        const createdProduct =
          response?.data;

        console.log(
          "Produit créé :",
          createdProduct
        );

        const formattedProduct =
          {
            id:
              createdProduct?.id,

            title:
              createdProduct?.nom ||
              title,

            quantity:
              formatQuantity(
                createdProduct?.stock_courant ??
                  createdProduct?.stock_initial ??
                  quantity
              ),

            unit:
              getDisplayUnit(
                createdProduct?.unite ??
                  newProduct.unit
              ),

            threshold:
              formatQuantity(
                createdProduct?.alerte_seuil ??
                  1
              ),

            type_produit:
              createdProduct?.type_produit ||
              "aliment",

            grammage_boite:
              createdProduct?.grammage_boite ??
              null,
          };

        const updatedProducts =
          [
            ...products,
            formattedProduct,
          ];

        setProducts(
          updatedProducts
        );

        saveToDistributionPage(
          updatedProducts
        );

        setNewProduct({
          title: "",
          quantity: 0,
          unit: "Kg",
        });

        setProductError("");
        setShowAddProduct(
          false
        );
      } catch (error) {
        console.error(
          "Erreur lors de la création du produit :",
          error
        );

        if (
          error?.response?.data
        ) {
          const backendError =
            error.response.data;

          if (
            typeof backendError ===
            "string"
          ) {
            setProductError(
              backendError
            );
          } else if (
            backendError.detail
          ) {
            setProductError(
              backendError.detail
            );
          } else {
            const firstError =
              Object.values(
                backendError
              )[0];

            if (
              Array.isArray(
                firstError
              )
            ) {
              setProductError(
                firstError[0]
              );
            } else if (
              typeof firstError ===
              "string"
            ) {
              setProductError(
                firstError
              );
            } else {
              setProductError(
                "Impossible de créer le produit."
              );
            }
          }
        } else {
          setProductError(
            "Une erreur est survenue. Vérifiez la connexion au serveur."
          );
        }
      } finally {
        setIsAddingProduct(
          false
        );
      }
    };

  // =========================================================
  // CANCEL ADD PRODUCT
  // =========================================================

  const handleCancelAddProduct =
    () => {
      setShowAddProduct(
        false
      );

      setProductError("");

      setNewProduct({
        title: "",
        quantity: 0,
        unit: "Kg",
      });
    };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AnimatePresence>
      <div
        className="
          fixed
          inset-0
          z-50
          bg-[#9A9A9A]/60
          flex
          items-start
          sm:items-center
          justify-center
          overflow-y-auto
        "
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
            sm:max-w-[550px]
            sm:h-[90vh]
            bg-white
            rounded-none
            sm:rounded-[20px]
            shadow-none
            sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="px-5 pt-5 pb-5">
            <PageHeader
              leftTitle="Fermer"
              showRight={false}
              onBack={onClose}
            />

            <h2
              className="
                mt-3
                text-center
                text-[22px]
                sm:text-[20px]
                font-semibold
                text-[#202124]
              "
            >
              Stock de produits
            </h2>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-5
              pb-4
              space-y-2
            "
          >
            {products.length > 0 ? (
              products.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      product.id ??
                      index
                    }
                    className="
                      min-h-[44px]
                      border
                      border-[#84D6D0]
                      rounded-[12px]
                      px-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    {/* PRODUCT NAME */}

                    <span className="text-[15px] font-medium">
                      {
                        product.title
                      }
                    </span>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-2">
                      {/* QUANTITY */}

                      <div className="flex items-end gap-1">
                        <span
                          className="
                            text-[#4E9F8A]
                            font-bold
                            text-[18px]
                          "
                        >
                          {formatQuantity(
                            product.quantity
                          )}
                        </span>

                        <span>
                          {
                            product.unit
                          }
                        </span>
                      </div>

                      {/* INCREMENT */}

                      {pendingIndex !==
                      index ? (
                        <button
                          onClick={() =>
                            handleIncrement(
                              index
                            )
                          }
                          disabled={
                            isAddingStock
                          }
                          className="
                            w-7
                            h-7
                            rounded-[8px]
                            bg-[#8CCDC0]
                            hover:bg-[#74C3B2]
                            disabled:opacity-50
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Plus
                            size={15}
                            color="white"
                          />
                        </button>
                      ) : (
                        <>
                          {/* CONFIRM */}

                          <button
                            onClick={
                              handleConfirm
                            }
                            disabled={
                              isAddingStock
                            }
                            className="
                              w-7
                              h-7
                              rounded-[8px]
                              bg-[#4E9F8A]
                              hover:bg-[#418978]
                              disabled:opacity-50
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Check
                              size={15}
                              color="white"
                            />
                          </button>

                          {/* INPUT */}

                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoFocus
                            disabled={
                              isAddingStock
                            }
                            value={
                              incrementValue
                            }
                            onChange={(e) =>
                              setIncrementValue(
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                )
                              )
                            }
                            className="
                              w-14
                              h-7
                              rounded-[8px]
                              border
                              border-[#84D6D0]
                              text-center
                              text-[13px]
                              outline-none
                              focus:border-[#4E9F8A]
                            "
                          />

                          {/* CANCEL */}

                          <button
                            onClick={
                              handleCancel
                            }
                            disabled={
                              isAddingStock
                            }
                            className="
                              w-7
                              h-7
                              rounded-[8px]
                              bg-[#EF4444]
                              hover:bg-[#dc2626]
                              disabled:opacity-50
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <X
                              size={15}
                              color="white"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="py-10 text-center text-gray-500">
                Aucun produit.
              </div>
            )}

            {/* ERROR */}

            {productError &&
              !showAddProduct && (
                <p
                  className="
                    text-[#DC2626]
                    text-[13px]
                    mt-2
                    ml-1
                  "
                >
                  {
                    productError
                  }
                </p>
              )}
          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div
            className="
              bg-white
              px-5
              py-4
              shrink-0
            "
          >
            {!showAddProduct ? (
              <Button
                title="Ajouter un produit"
                variant="gris"
                noWrapperPadding
                onClick={
                  handleOpenAddProduct
                }
              />
            ) : (
              <div className="space-y-3">
                {/* ADD PRODUCT FORM */}

                <div
                  className="
                    flex
                    items-center
                    bg-[#F2FAFA]
                    border
                    border-[#91A09F]
                    rounded-[10px]
                    h-[48px]
                    overflow-hidden
                  "
                >
                  {/* NAME */}

                  <input
                    type="text"
                    placeholder="Tapez le nom"
                    value={
                      newProduct.title
                    }
                    disabled={
                      isAddingProduct
                    }
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        title:
                          e.target.value,
                      });

                      setProductError(
                        ""
                      );
                    }}
                    className="
                      flex-1
                      h-full
                      px-4
                      outline-none
                      bg-transparent
                      text-[15px]
                    "
                  />

                  {/* QUANTITY */}

                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      newProduct.quantity
                    }
                    disabled={
                      isAddingProduct
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setNewProduct({
                        ...newProduct,
                        quantity:
                          value === ""
                            ? 0
                            : Number(
                                value
                              ),
                      });

                      setProductError(
                        ""
                      );
                    }}
                    className="
                      w-[45px]
                      text-center
                      outline-none
                      bg-transparent
                      text-[#4E9F8A]
                      font-bold
                      text-[22px]
                    "
                  />

                  {/* UNIT */}

                  <select
                    value={
                      newProduct.unit
                    }
                    disabled={
                      isAddingProduct
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        unit:
                          e.target.value,
                      })
                    }
                    className="
                      h-full
                      bg-transparent
                      outline-none
                      cursor-pointer
                      text-[15px]
                      pr-3
                    "
                  >
                    <option>
                      Kg
                    </option>

                    <option>
                      Litres
                    </option>

                    <option>
                      boîtes
                    </option>

                    <option>
                      Sacs
                    </option>

                    <option>
                      Pièces
                    </option>
                  </select>
                </div>

                {/* ERROR */}

                {productError && (
                  <p
                    className="
                      text-[#DC2626]
                      text-[13px]
                      mt-1
                      ml-1
                    "
                  >
                    {
                      productError
                    }
                  </p>
                )}

                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Button
                      title={
                        isAddingProduct
                          ? "Sauvegarde..."
                          : "Sauvegarder"
                      }
                      variant="gris"
                      noWrapperPadding
                      onClick={
                        handleAddProduct
                      }
                    />
                  </div>

                  <div className="flex-1">
                    <Button
                      title="Annuler"
                      variant="outline"
                      noWrapperPadding
                      onClick={
                        handleCancelAddProduct
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                EDIT THRESHOLDS
            ================================================= */}

            <div className="mt-4">
              <Button
                title="Modifier les seuils d'alertes nutritionnelles"
                variant="modifier"
                icon={Edit}
                noWrapperPadding
                onClick={() =>
                  setShowEditPopup(
                    true
                  )
                }
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          EDIT STOCK POPUP
      ===================================================== */}

      {showEditPopup && (
        <EditStockPopup
          open={showEditPopup}
          products={products}
          isSaving={
            isSavingThresholds
          }
          onClose={() =>
            !isSavingThresholds &&
            setShowEditPopup(
              false
            )
          }
          onSave={
            handleSaveThresholds
          }
        />
      )}
    </AnimatePresence>
  );
};

export default StockPopup;
