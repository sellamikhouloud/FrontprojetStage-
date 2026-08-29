import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import Edit from "../../assets/Edit 2.svg";
import { Plus, Check, X } from "lucide-react";

import EditStockPopup from "./EditStockPopup";
import SelectInput from "../Containers/ChoiceContainer";

import {
  CreateProduit,
  listProduits,
  ajouterStock,
  modifierSeuil,
  updateProduit,
} from "../../lib/api/stock";

const StockPopup = ({ onClose, initialProducts = [], onSaveProducts }) => {
  // =========================================================
  // STATES
  // =========================================================

  const [showEditPopup, setShowEditPopup] = useState(false);

  const [products, setProducts] = useState([]);

  const [pendingIndex, setPendingIndex] = useState(null);
  const [incrementValue, setIncrementValue] = useState("");
  const [backupProducts, setBackupProducts] = useState([]);

  const timerRef = useRef(null);

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    quantity: 0,
    unit: "Kg",
    type_produit: "aliment",
    laitType: "",
    grammage_boite: "",
  });

  const [productError, setProductError] = useState("");

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isSavingThresholds, setIsSavingThresholds] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // =========================================================
  // MODIFY PRODUCT
  // =========================================================

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductName, setEditingProductName] = useState("");
  const [editingMilkType, setEditingMilkType] = useState("");

  // =========================================================
  // OPTIONS
  // =========================================================

  const productTypeOptions = ["Aliment", "Lait infantile"];

  const milkTypeOptions = ["Lait 1er âge", "Lait 2ème âge"];

  // =========================================================
  // NORMALIZE TEXT
  // =========================================================

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // =========================================================
  // FORMAT QUANTITY
  // =========================================================

  const formatQuantity = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Number(number.toFixed(2));
  };

  // =========================================================
  // GET PRODUCT ID
  // =========================================================

  const getProductId = (product) => {
    if (!product) {
      return null;
    }

    return (
      product.id ??
      product.produit?.id ??
      product.produit_id ??
      product.product_id ??
      null
    );
  };

  // =========================================================
  // GET PRODUCT NAME
  // =========================================================

  const getProductName = (product) => {
    if (!product) {
      return "";
    }

    return (
      product.nom ??
      product.title ??
      product.produit?.nom ??
      ""
    );
  };

  // =========================================================
  // GET PRODUCT TYPE
  // =========================================================

  const getProductType = (product) => {
    if (!product) {
      return "aliment";
    }

    return (
      product.type_produit ??
      product.produit?.type_produit ??
      "aliment"
    );
  };

  // =========================================================
  // GET PRODUCT UNIT
  // =========================================================

  const getProductUnit = (product) => {
    if (!product) {
      return "kg";
    }

    return (
      product.unite ??
      product.unit ??
      product.produit?.unite ??
      "kg"
    );
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
  // GET PRODUCT QUANTITY
  // =========================================================

  const getProductQuantity = (product) => {
    if (!product) {
      return 0;
    }

    return (
      product.stock_courant ??
      product.quantity ??
      product.produit?.stock_courant ??
      0
    );
  };

  // =========================================================
  // GET PRODUCT THRESHOLD
  // =========================================================

  const getProductThreshold = (product) => {
    if (!product) {
      return 1;
    }

    return (
      product.alerte_seuil ??
      product.threshold ??
      product.produit?.alerte_seuil ??
      1
    );
  };

  // =========================================================
  // GET PRODUCT GRAMMAGE
  // =========================================================

  const getProductGrammage = (product) => {
    if (!product) {
      return null;
    }

    if (
      product.grammage_boite !== undefined &&
      product.grammage_boite !== null
    ) {
      return product.grammage_boite;
    }

    if (
      product.produit?.grammage_boite !== undefined &&
      product.produit?.grammage_boite !== null
    ) {
      return product.produit.grammage_boite;
    }

    return null;
  };

  // =========================================================
  // BACKEND PRODUCT TYPE
  // =========================================================

  const getBackendProductType = (displayType) => {
    return displayType === "Lait infantile"
      ? "lait"
      : "aliment";
  };

  // =========================================================
  // GET MILK PRODUCT NAME
  // =========================================================

  const getMilkProductName = (milkType) => {
    const normalized = normalizeText(milkType);

    if (
      normalized === "lait 1er age" ||
      normalized === "1er age"
    ) {
      return "Lait 1er âge";
    }

    if (
      normalized === "lait 2eme age" ||
      normalized === "2eme age"
    ) {
      return "Lait 2ème âge";
    }

    return "";
  };

  // =========================================================
  // GET MILK TYPE FROM PRODUCT NAME
  // =========================================================

  const getMilkTypeFromName = (productName) => {
    const normalized = normalizeText(productName);

    if (
      normalized.includes("lait 1er age") ||
      normalized.includes("1er age")
    ) {
      return "Lait 1er âge";
    }

    if (
      normalized.includes("lait 2eme age") ||
      normalized.includes("2eme age")
    ) {
      return "Lait 2ème âge";
    }

    return "";
  };

  // =========================================================
  // IS MILK PRODUCT
  //
  // IMPORTANT:
  // We check BOTH the backend type and the product name.
  // This makes the milk ChoiceContainer survive reloads
  // even if the parent object is incomplete.
  // =========================================================

  const isMilkProduct = (product) => {
    if (!product) {
      return false;
    }

    const backendType = normalizeText(
      product.type_produit ??
      product.produit?.type_produit ??
      ""
    );

    if (backendType === "lait") {
      return true;
    }

    const productName = getProductName(product);

    const milkType = getMilkTypeFromName(productName);

    return milkType !== "";
  };

  // =========================================================
  // GET BACKEND ERROR
  // =========================================================

  const getBackendErrorMessage = (error, defaultMessage) => {
    if (!error?.response?.data) {
      return error?.message || defaultMessage;
    }

    const backendError = error.response.data;

    if (typeof backendError === "string") {
      return backendError;
    }

    if (backendError.detail) {
      return backendError.detail;
    }

    const firstError = Object.values(backendError)[0];

    if (Array.isArray(firstError)) {
      return firstError[0];
    }

    if (typeof firstError === "string") {
      return firstError;
    }

    return defaultMessage;
  };

  // =========================================================
  // FORMAT PRODUCT
  // =========================================================

  const formatProduct = (product) => {
    const type = getProductType(product);
    const name = getProductName(product);
    const grammage = getProductGrammage(product);

    return {
      id: getProductId(product),

      title: name,

      quantity: formatQuantity(
        getProductQuantity(product)
      ),

      unit: getDisplayUnit(
        getProductUnit(product)
      ),

      threshold: formatQuantity(
        getProductThreshold(product)
      ),

      type_produit: type,

      grammage_boite:
        grammage !== null &&
        grammage !== undefined &&
        grammage !== ""
          ? Number(grammage)
          : null,
    };
  };

  // =========================================================
  // EXTRACT PRODUCTS FROM RESPONSE
  // =========================================================

  const extractProductsFromResponse = (response) => {
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.results)) {
      return response.data.results;
    }

    return [];
  };

  // =========================================================
  // LOAD COMPLETE PRODUCTS
  //
  // IMPORTANT FIX:
  //
  // initialProducts may not contain grammage_boite after
  // a page reload.
  //
  // Therefore we ALWAYS retrieve the complete product list
  // from the backend.
  // =========================================================

  const loadProductsFromBackend = async () => {
    try {
      const response = await listProduits();

      const firstPageProducts =
        extractProductsFromResponse(response);

      let allProducts = [...firstPageProducts];

      // =====================================================
      // PAGINATION
      // =====================================================

      let next = response?.data?.next;
      let page = 2;

      const MAX_PAGES = 100;

      while (next && page <= MAX_PAGES) {
        const nextResponse = await listProduits({
          page,
        });

        const pageProducts =
          extractProductsFromResponse(nextResponse);

        allProducts = [
          ...allProducts,
          ...pageProducts,
        ];

        next = nextResponse?.data?.next;

        page += 1;
      }

      // =====================================================
      // FORMAT BACKEND DATA
      // =====================================================

      const formattedBackendProducts = allProducts
        .map(formatProduct)
        .filter(
          (product) =>
            getProductId(product) !== null &&
            getProductId(product) !== undefined
        );

      // =====================================================
      // FALLBACK TO INITIAL PRODUCTS
      // =====================================================

      if (formattedBackendProducts.length === 0) {
        const formattedInitialProducts =
          (initialProducts || [])
            .map(formatProduct)
            .filter(
              (product) =>
                getProductId(product) !== null &&
                getProductId(product) !== undefined
            );

        setProducts(formattedInitialProducts);

        return;
      }

      console.log(
        "Produits complets récupérés depuis le backend :",
        formattedBackendProducts
      );

      console.log(
        "Grammages récupérés :",
        formattedBackendProducts.map((product) => ({
          id: product.id,
          nom: product.title,
          type: product.type_produit,
          grammage_boite: product.grammage_boite,
        }))
      );

      setProducts(formattedBackendProducts);
    } catch (error) {
      console.error(
        "Erreur récupération des produits :",
        error
      );

      // =====================================================
      // FALLBACK
      // =====================================================

      const formattedInitialProducts =
        (initialProducts || [])
          .map(formatProduct)
          .filter(
            (product) =>
              getProductId(product) !== null &&
              getProductId(product) !== undefined
          );

      setProducts(formattedInitialProducts);
    }
  };

  // =========================================================
  // INITIAL PRODUCTS
  //
  // We first display initialProducts.
  // Then we retrieve the COMPLETE backend data.
  // =========================================================

  useEffect(() => {
    const formattedProducts =
      (initialProducts || [])
        .map(formatProduct)
        .filter(
          (product) =>
            getProductId(product) !== null &&
            getProductId(product) !== undefined
        );

    console.log(
      "Produits reçus après refresh :",
      initialProducts
    );

    console.log(
      "Produits initialement formatés :",
      formattedProducts
    );

    setProducts(formattedProducts);

    loadProductsFromBackend();
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

  const saveToDistributionPage = (updatedProducts) => {
    if (!onSaveProducts) {
      return;
    }

    const productsForParent = updatedProducts
      .filter(
        (product) =>
          getProductId(product) !== null &&
          getProductId(product) !== undefined
      )
      .map((product) => ({
        id: getProductId(product),

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

        type_produit:
          product.type_produit,

        grammage_boite:
          product.grammage_boite !== undefined &&
          product.grammage_boite !== null
            ? Number(product.grammage_boite)
            : null,
      }));

    onSaveProducts(productsForParent);
  };

  // =========================================================
  // FIND CREATED PRODUCT AFTER POST
  // =========================================================

  const findCreatedProductAfterPost = async (
    createdProduct,
    payload
  ) => {
    const directId =
      getProductId(createdProduct);

    if (
      directId !== null &&
      directId !== undefined
    ) {
      return createdProduct;
    }

    let page = 1;
    let allProducts = [];
    let hasNextPage = true;

    const MAX_PAGES = 100;

    while (
      hasNextPage &&
      page <= MAX_PAGES
    ) {
      const response =
        await listProduits({ page });

      const pageProducts =
        extractProductsFromResponse(response);

      allProducts = [
        ...allProducts,
        ...pageProducts,
      ];

      const next =
        response?.data?.next;

      if (next) {
        page += 1;
      } else {
        hasNextPage = false;
      }

      if (Array.isArray(response?.data)) {
        hasNextPage = false;
      }
    }

    const normalizedName =
      normalizeText(payload.nom);

    let matchingProducts =
      allProducts.filter(
        (product) =>
          normalizeText(product?.nom) ===
          normalizedName
      );

    if (
      payload.type_produit === "lait"
    ) {
      matchingProducts =
        matchingProducts.filter(
          (product) =>
            product?.type_produit === "lait" &&
            Number(
              product?.grammage_boite
            ) ===
              Number(
                payload.grammage_boite
              )
        );
    } else {
      matchingProducts =
        matchingProducts.filter(
          (product) =>
            product?.type_produit ===
            "aliment"
        );
    }

    let foundProduct =
      matchingProducts[0];

    if (
      matchingProducts.length > 1
    ) {
      foundProduct =
        [...matchingProducts].sort(
          (a, b) => {
            const dateA =
              new Date(
                a?.audit?.date_creation || 0
              ).getTime();

            const dateB =
              new Date(
                b?.audit?.date_creation || 0
              ).getTime();

            return dateB - dateA;
          }
        )[0];
    }

    if (!foundProduct) {
      throw new Error(
        "Le produit créé n'a pas pu être retrouvé."
      );
    }

    const foundId =
      getProductId(foundProduct);

    if (
      foundId === null ||
      foundId === undefined
    ) {
      throw new Error(
        "Le produit a été retrouvé mais son identifiant est manquant."
      );
    }

    return foundProduct;
  };

  // =========================================================
  // START EDIT PRODUCT
  // =========================================================

  const handleStartEditProduct = (
    product
  ) => {
    const productId =
      getProductId(product);

    if (
      productId === null ||
      productId === undefined
    ) {
      setProductError(
        "Impossible de modifier ce produit : identifiant manquant."
      );
      return;
    }

    setProductError("");
    setEditingProductId(productId);

    const productName =
      getProductName(product);

    // =======================================================
    // MILK
    // =======================================================

    if (isMilkProduct(product)) {
      const milkType =
        getMilkTypeFromName(
          productName
        );

      console.log(
        "Modification lait :",
        {
          id: productId,
          nom: productName,
          type_produit:
            product.type_produit,
          grammage_boite:
            product.grammage_boite,
          choiceValue: milkType,
        }
      );

      // ALWAYS set milk type.
      setEditingMilkType(
        milkType
      );

      // Keep original name internally.
      setEditingProductName(
        productName
      );

      return;
    }

    // =======================================================
    // NORMAL PRODUCT
    // =======================================================

    setEditingProductName(
      productName
    );

    setEditingMilkType("");
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEditProduct = () => {
    if (isEditingProduct) {
      return;
    }

    setEditingProductId(null);
    setEditingProductName("");
    setEditingMilkType("");
    setProductError("");
  };

  // =========================================================
  // SAVE PRODUCT NAME
  // =========================================================

  const handleSaveProductName =
    async () => {
      if (
        editingProductId === null ||
        editingProductId === undefined
      ) {
        setProductError(
          "Produit invalide."
        );
        return;
      }

      const product =
        products.find(
          (item) =>
            String(item.id) ===
            String(editingProductId)
        );

      if (!product) {
        setProductError(
          "Produit introuvable."
        );
        return;
      }

      const isMilk =
        isMilkProduct(product);

      // =====================================================
      // DETERMINE NEW NAME
      // =====================================================

      let newName =
        editingProductName.trim();

      // =====================================================
      // MILK
      // =====================================================

      if (isMilk) {
        if (!editingMilkType) {
          setProductError(
            "Veuillez choisir le type de lait."
          );
          return;
        }

        newName =
          getMilkProductName(
            editingMilkType
          );

        if (!newName) {
          setProductError(
            "Type de lait invalide."
          );
          return;
        }
      }

      // =====================================================
      // NORMAL PRODUCT
      // =====================================================

      if (
        !isMilk &&
        !newName
      ) {
        setProductError(
          "Veuillez saisir le nom du produit."
        );
        return;
      }

      // =====================================================
      // NEVER ALLOW JUST "LAIT"
      // =====================================================

      if (
        normalizeText(newName) ===
        "lait"
      ) {
        setProductError(
          "Un produit lait doit être 1er âge ou 2ème âge."
        );
        return;
      }

      // =====================================================
      // CHECK NAME CHANGE
      // =====================================================

      const nameChanged =
        normalizeText(newName) !==
        normalizeText(product.title);

      if (!nameChanged) {
        handleCancelEditProduct();
        return;
      }

      // =====================================================
      // DUPLICATE
      // =====================================================

      const alreadyExists =
        products.some((item) => {
          if (
            String(item.id) ===
            String(editingProductId)
          ) {
            return false;
          }

          return (
            normalizeText(
              item.title
            ) ===
            normalizeText(newName)
          );
        });

      if (alreadyExists) {
        setProductError(
          "Ce produit existe déjà."
        );
        return;
      }

      setProductError("");
      setIsEditingProduct(true);

      try {
        // ===================================================
        // ONLY SEND NAME
        //
        // IMPORTANT:
        // grammage_boite is NOT sent.
        // ===================================================

        const payload = {
          nom: newName,
        };

        console.log(
          "PATCH MODIFICATION PRODUIT"
        );

        console.log(
          "ID :",
          editingProductId
        );

        console.log(
          "Payload :",
          payload
        );

        const response =
          await updateProduit(
            editingProductId,
            payload
          );

        console.log(
          "Réponse PATCH :",
          response?.data
        );

        const updatedProduct =
          response?.data;

        // ===================================================
        // UPDATE LOCAL PRODUCT
        //
        // NEVER replace grammage with null.
        // ===================================================

        const updatedProducts =
          products.map(
            (currentProduct) => {
              if (
                String(
                  currentProduct.id
                ) !==
                String(
                  editingProductId
                )
              ) {
                return currentProduct;
              }

              return {
                ...currentProduct,

                id:
                  getProductId(
                    updatedProduct
                  ) ??
                  currentProduct.id,

                title:
                  updatedProduct?.nom ??
                  newName,

                quantity:
                  formatQuantity(
                    updatedProduct?.stock_courant ??
                      currentProduct.quantity
                  ),

                unit:
                  getDisplayUnit(
                    updatedProduct?.unite ??
                      getBackendUnit(
                        currentProduct.unit
                      )
                  ),

                threshold:
                  formatQuantity(
                    updatedProduct?.alerte_seuil ??
                      currentProduct.threshold
                  ),

                type_produit:
                  updatedProduct?.type_produit ??
                  currentProduct.type_produit,

                // =========================================
                // VERY IMPORTANT
                //
                // Preserve the existing grammage.
                // =========================================

                grammage_boite:
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

        // ===================================================
        // CLOSE EDIT
        // ===================================================

        setEditingProductId(null);
        setEditingProductName("");
        setEditingMilkType("");
        setProductError("");
      } catch (error) {
        console.error(
          "Erreur modification produit :",
          error
        );

        setProductError(
          getBackendErrorMessage(
            error,
            "Impossible de modifier le produit."
          )
        );
      } finally {
        setIsEditingProduct(false);
      }
    };

  // =========================================================
  // SAVE THRESHOLDS
  // =========================================================

  const handleSaveThresholds =
    async (updatedThresholds) => {
      if (
        !Array.isArray(
          updatedThresholds
        ) ||
        updatedThresholds.length === 0
      ) {
        return;
      }

      setIsSavingThresholds(true);
      setProductError("");

      try {
        const updatedProducts = [
          ...products,
        ];

        for (
          const editedProduct of
            updatedThresholds
        ) {
          const editedId =
            getProductId(
              editedProduct
            );

          if (
            editedId === null ||
            editedId === undefined
          ) {
            continue;
          }

          const newThreshold =
            Number(
              editedProduct.threshold ??
                editedProduct.alerte_seuil
            );

          if (
            Number.isNaN(
              newThreshold
            ) ||
            newThreshold < 0
          ) {
            throw new Error(
              `Seuil invalide pour le produit ${getProductName(
                editedProduct
              )}`
            );
          }

          const currentProduct =
            products.find(
              (product) =>
                String(product.id) ===
                String(editedId)
            );

          if (!currentProduct) {
            continue;
          }

          if (
            Number(
              currentProduct.threshold
            ) !==
            newThreshold
          ) {
            const payload = {
              alerte_seuil:
                newThreshold,
            };

            const response =
              await modifierSeuil(
                editedId,
                payload
              );

            const backendProduct =
              response?.data;

            const productIndex =
              updatedProducts.findIndex(
                (product) =>
                  String(product.id) ===
                  String(editedId)
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

                grammage_boite:
                  updatedProducts[
                    productIndex
                  ].grammage_boite,
              };
            }
          }
        }

        setProducts(
          updatedProducts
        );

        saveToDistributionPage(
          updatedProducts
        );

        setShowEditPopup(false);
      } catch (error) {
        console.error(
          "Erreur modification seuil :",
          error
        );

        setProductError(
          getBackendErrorMessage(
            error,
            "Impossible de modifier le seuil."
          )
        );
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

  const handleConfirm =
    async () => {
      if (
        incrementValue === "" ||
        Number(incrementValue) <= 0
      ) {
        setProductError(
          "Veuillez saisir une quantité valide."
        );
        return;
      }

      if (
        pendingIndex === null
      ) {
        return;
      }

      const product =
        products[pendingIndex];

      const productId =
        getProductId(product);

      if (
        productId === null ||
        productId === undefined
      ) {
        setProductError(
          "Impossible de modifier ce produit : identifiant manquant."
        );
        return;
      }

      setProductError("");
      setIsAddingStock(true);

      try {
        const quantityToAdd =
          Number(incrementValue);

        const payload = {
          quantite:
            String(quantityToAdd),
        };

        const response =
          await ajouterStock(
            productId,
            payload
          );

        const updatedProduct =
          response?.data;

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
                  getProductId(
                    updatedProduct
                  ) ??
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

                // Preserve grammage
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

        setProductError(
          getBackendErrorMessage(
            error,
            "Impossible d'ajouter le stock."
          )
        );
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
        type_produit: "aliment",
        laitType: "",
        grammage_boite: "",
      });

      setShowAddProduct(true);
    };

  // =========================================================
  // SELECT PRODUCT TYPE
  // =========================================================

  const handleProductTypeChange =
    (selectedType) => {
      const isMilk =
        selectedType ===
        "Lait infantile";

      setProductError("");

      setNewProduct(
        (previous) => ({
          ...previous,

          type_produit:
            getBackendProductType(
              selectedType
            ),

          title: isMilk
            ? ""
            : previous.title,

          laitType: isMilk
            ? previous.laitType
            : "",

          unit: isMilk
            ? "boîtes"
            : previous.unit,

          grammage_boite:
            isMilk
              ? previous.grammage_boite
              : "",
        })
      );
    };

  // =========================================================
  // SELECT MILK TYPE - ADD
  // =========================================================

  const handleMilkTypeChange =
    (selectedMilkType) => {
      const milkName =
        getMilkProductName(
          selectedMilkType
        );

      setProductError("");

      setNewProduct(
        (previous) => ({
          ...previous,

          laitType:
            selectedMilkType,

          title: milkName,
        })
      );
    };

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const handleAddProduct =
    async () => {
      const isMilk =
        newProduct.type_produit ===
        "lait";

      // =====================================================
      // MILK TYPE
      // =====================================================

      if (
        isMilk &&
        !newProduct.laitType
      ) {
        setProductError(
          "Veuillez choisir le type de lait."
        );
        return;
      }

      let title =
        newProduct.title.trim();

      if (isMilk) {
        title =
          getMilkProductName(
            newProduct.laitType
          );

        if (!title) {
          setProductError(
            "Type de lait invalide."
          );
          return;
        }
      }

      // =====================================================
      // NAME
      // =====================================================

      if (!title) {
        setProductError(
          "Veuillez saisir le nom du produit."
        );
        return;
      }

      if (
        normalizeText(title) ===
        "lait"
      ) {
        setProductError(
          "Un produit lait doit être 1er âge ou 2ème âge."
        );
        return;
      }

      // =====================================================
      // QUANTITY
      // =====================================================

      const quantity =
        Number(
          newProduct.quantity
        );

      if (
        newProduct.quantity === "" ||
        Number.isNaN(quantity) ||
        quantity < 0
      ) {
        setProductError(
          "Veuillez saisir une quantité valide."
        );
        return;
      }

      // =====================================================
      // GRAMMAGE
      // =====================================================

      let grammage = null;

      if (isMilk) {
        if (
          newProduct.grammage_boite ===
            "" ||
          newProduct.grammage_boite ===
            null ||
          newProduct.grammage_boite ===
            undefined
        ) {
          setProductError(
            "Le grammage de la boîte est obligatoire pour un produit de type lait."
          );
          return;
        }

        grammage =
          Number(
            newProduct.grammage_boite
          );

        if (
          Number.isNaN(
            grammage
          ) ||
          grammage <= 0
        ) {
          setProductError(
            "Le grammage de la boîte doit être supérieur à 0."
          );
          return;
        }

        grammage =
          Math.round(grammage);
      }

      // =====================================================
      // DUPLICATE
      // =====================================================

      const alreadyExists =
        products.some(
          (product) => {
            const sameName =
              normalizeText(
                product.title
              ) ===
              normalizeText(
                title
              );

            if (!sameName) {
              return false;
            }

            if (isMilk) {
              return (
                product.type_produit ===
                  "lait" &&
                Number(
                  product.grammage_boite
                ) ===
                  Number(grammage)
              );
            }

            return true;
          }
        );

      if (alreadyExists) {
        setProductError(
          "Ce produit existe déjà."
        );
        return;
      }

      setProductError("");
      setIsAddingProduct(true);

      try {
        // ===================================================
        // CREATE PAYLOAD
        // ===================================================

        const payload = {
          nom: title,

          type_produit: isMilk
            ? "lait"
            : "aliment",

          unite: isMilk
            ? "boite"
            : getBackendUnit(
                newProduct.unit
              ),

          stock_courant:
            String(quantity),

          alerte_seuil: "1",

          grammage_boite:
            isMilk
              ? grammage
              : null,
        };

        console.log(
          "CRÉATION PRODUIT",
          payload
        );

        const response =
          await CreateProduit(
            payload
          );

        const createdProduct =
          response?.data;

        const directCreatedId =
          getProductId(
            createdProduct
          );

        let productWithId;

        if (
          directCreatedId !==
            null &&
          directCreatedId !==
            undefined
        ) {
          productWithId =
            createdProduct;
        } else {
          productWithId =
            await findCreatedProductAfterPost(
              createdProduct,
              payload
            );
        }

        const createdProductId =
          getProductId(
            productWithId
          );

        if (
          createdProductId ===
            null ||
          createdProductId ===
            undefined
        ) {
          throw new Error(
            "Le produit créé n'a pas pu être retrouvé."
          );
        }

        // ===================================================
        // VERIFY GRAMMAGE
        // ===================================================

        let realGrammage = null;

        if (isMilk) {
          realGrammage =
            productWithId?.grammage_boite;

          if (
            realGrammage ===
              null ||
            realGrammage ===
              undefined
          ) {
            throw new Error(
              "Le produit a été créé, mais le backend a retourné grammage_boite = null."
            );
          }

          if (
            Number(
              realGrammage
            ) !==
            Number(grammage)
          ) {
            throw new Error(
              `Le backend a enregistré ${realGrammage} g au lieu de ${grammage} g.`
            );
          }
        }

        // ===================================================
        // FORMAT CREATED PRODUCT
        // ===================================================

        const formattedProduct = {
          id: createdProductId,

          title:
            productWithId?.nom ||
            title,

          quantity:
            formatQuantity(
              productWithId?.stock_courant ??
                quantity
            ),

          unit:
            getDisplayUnit(
              productWithId?.unite ??
                payload.unite
            ),

          threshold:
            formatQuantity(
              productWithId?.alerte_seuil ??
                1
            ),

          type_produit:
            productWithId?.type_produit ??
            payload.type_produit,

          grammage_boite:
            isMilk
              ? Number(
                  realGrammage
                )
              : null,
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

        // ===================================================
        // RESET
        // ===================================================

        setNewProduct({
          title: "",
          quantity: 0,
          unit: "Kg",
          type_produit: "aliment",
          laitType: "",
          grammage_boite: "",
        });

        setProductError("");
        setShowAddProduct(false);
      } catch (error) {
        console.error(
          "Erreur lors de la création du produit :",
          error
        );

        setProductError(
          getBackendErrorMessage(
            error,
            "Impossible de créer le produit."
          )
        );
      } finally {
        setIsAddingProduct(false);
      }
    };

  // =========================================================
  // CANCEL ADD PRODUCT
  // =========================================================

  const handleCancelAddProduct =
    () => {
      setShowAddProduct(false);
      setProductError("");

      setNewProduct({
        title: "",
        quantity: 0,
        unit: "Kg",
        type_produit: "aliment",
        laitType: "",
        grammage_boite: "",
      });
    };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#9A9A9A]/60 flex items-start sm:items-center justify-center overflow-y-auto">
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
          className="w-full min-h-screen sm:min-h-0 sm:max-w-[550px] sm:h-[90vh] bg-white rounded-none sm:rounded-[20px] shadow-none sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
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

            <h2 className="mt-3 text-center text-[22px] sm:text-[20px] font-semibold text-[#202124]">
              Stock de produits
            </h2>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-2">
            {products.length >
            0 ? (
              products.map(
                (
                  product,
                  index
                ) => {
                  const isEditing =
                    editingProductId !==
                      null &&
                    String(
                      editingProductId
                    ) ===
                      String(
                        product.id
                      );

                  const milkProduct =
                    isMilkProduct(
                      product
                    );

                  return (
                    <div
                      key={
                        product.id ??
                        `product-${index}`
                      }
                      className="min-h-[44px] border border-[#84D6D0] rounded-[12px] px-3 py-1.5 flex items-center justify-between gap-2"
                    >
                      {/* =========================================
                          EDIT MODE
                      ========================================= */}

                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* =======================================
                              MILK EDIT
                          ======================================= */}

                          {milkProduct ? (
                            <div className="flex-1 min-w-0">
                              <SelectInput
                                label=""
                                placeholder="Choisir le type de lait"
                                options={
                                  milkTypeOptions
                                }
                                value={
                                  editingMilkType
                                }
                                onChange={(
                                  selectedMilkType
                                ) => {
                                  setEditingMilkType(
                                    selectedMilkType
                                  );

                                  setProductError(
                                    ""
                                  );
                                }}
                                noPadding
                              />
                            </div>
                          ) : (
                            /* =====================================
                               NORMAL PRODUCT EDIT
                            ===================================== */

                            <input
                              type="text"
                              value={
                                editingProductName
                              }
                              disabled={
                                isEditingProduct
                              }
                              autoFocus
                              onChange={(
                                e
                              ) => {
                                setEditingProductName(
                                  e.target
                                    .value
                                );

                                setProductError(
                                  ""
                                );
                              }}
                              onKeyDown={(
                                e
                              ) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  handleSaveProductName();
                                }

                                if (
                                  e.key ===
                                  "Escape"
                                ) {
                                  handleCancelEditProduct();
                                }
                              }}
                              className="min-w-0 flex-1 h-8 px-2 rounded-[8px] border border-[#84D6D0] outline-none text-[15px] font-medium focus:border-[#4E9F8A]"
                            />
                          )}

                          {/* =======================================
                              SAVE
                          ======================================= */}

                          <button
                            onClick={
                              handleSaveProductName
                            }
                            disabled={
                              isEditingProduct
                            }
                            className="w-7 h-7 rounded-[8px] bg-[#4E9F8A] hover:bg-[#418978] disabled:opacity-50 flex items-center justify-center shrink-0"
                            title="Enregistrer"
                          >
                            <Check
                              size={15}
                              color="white"
                            />
                          </button>

                          {/* =======================================
                              CANCEL
                          ======================================= */}

                          <button
                            onClick={
                              handleCancelEditProduct
                            }
                            disabled={
                              isEditingProduct
                            }
                            className="w-7 h-7 rounded-[8px] bg-[#EF4444] hover:bg-[#dc2626] disabled:opacity-50 flex items-center justify-center shrink-0"
                            title="Annuler"
                          >
                            <X
                              size={15}
                              color="white"
                            />
                          </button>
                        </div>
                      ) : (
                        /* =========================================
                           NORMAL DISPLAY
                        ========================================= */

                        <span className="text-[15px] font-medium flex-1 min-w-0 truncate">
                          {product.title}

                          {milkProduct &&
                            product.grammage_boite !==
                              null &&
                            product.grammage_boite !==
                              undefined && (
                              <span className="ml-1 text-gray-500 text-[13px]">
                                (
                                {
                                  product.grammage_boite
                                }
                                g)
                              </span>
                            )}
                        </span>
                      )}

                      {/* =========================================
                          RIGHT SIDE
                      ========================================= */}

                      {!isEditing && (
                        <div className="flex items-center gap-2 shrink-0">
                          {/* =====================================
                              MODIFY
                          ===================================== */}

                          <button
                            onClick={() =>
                              handleStartEditProduct(
                                product
                              )
                            }
                            disabled={
                              isEditingProduct ||
                              pendingIndex ===
                                index
                            }
                            className="w-7 h-7 rounded-[8px] bg-[#8CCDC0] hover:bg-[#74C3B2] disabled:opacity-50 flex items-center justify-center shrink-0"
                            title="Modifier le produit"
                          >
                            <img
                              src={Edit}
                              alt="Modifier"
                              className="w-4 h-4"
                            />
                          </button>

                          {/* =====================================
                              QUANTITY
                          ===================================== */}

                          <div className="flex items-end gap-1">
                            <span className="text-[#4E9F8A] font-bold text-[18px]">
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

                          {/* =====================================
                              INCREMENT
                          ===================================== */}

                          {pendingIndex !==
                          index ? (
                            <button
                              onClick={() =>
                                handleIncrement(
                                  index
                                )
                              }
                              disabled={
                                isAddingStock ||
                                isEditingProduct
                              }
                              className="w-7 h-7 rounded-[8px] bg-[#8CCDC0] hover:bg-[#74C3B2] disabled:opacity-50 flex items-center justify-center"
                            >
                              <Plus
                                size={15}
                                color="white"
                              />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={
                                  handleConfirm
                                }
                                disabled={
                                  isAddingStock
                                }
                                className="w-7 h-7 rounded-[8px] bg-[#4E9F8A] hover:bg-[#418978] disabled:opacity-50 flex items-center justify-center"
                              >
                                <Check
                                  size={
                                    15
                                  }
                                  color="white"
                                />
                              </button>

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
                                onChange={(
                                  e
                                ) =>
                                  setIncrementValue(
                                    e.target.value.replace(
                                      /\D/g,
                                      ""
                                    )
                                  )
                                }
                                className="w-14 h-7 rounded-[8px] border border-[#84D6D0] text-center text-[13px] outline-none focus:border-[#4E9F8A]"
                              />

                              <button
                                onClick={
                                  handleCancel
                                }
                                disabled={
                                  isAddingStock
                                }
                                className="w-7 h-7 rounded-[8px] bg-[#EF4444] hover:bg-[#dc2626] disabled:opacity-50 flex items-center justify-center"
                              >
                                <X
                                  size={
                                    15
                                  }
                                  color="white"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )
            ) : (
              <div className="py-10 text-center text-gray-500">
                Aucun produit.
              </div>
            )}

            {/* ===============================================
                ERROR
            =============================================== */}

            {productError &&
              !showAddProduct && (
                <p className="text-[#DC2626] text-[13px] mt-2 ml-1">
                  {productError}
                </p>
              )}
          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div className="bg-white px-5 py-4 shrink-0">
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
                {/* =============================================
                    PRODUCT TYPE
                ============================================= */}

                <SelectInput
                  label="Type de produit"
                  placeholder="Choisir le type de produit"
                  options={
                    productTypeOptions
                  }
                  value={
                    newProduct.type_produit ===
                    "lait"
                      ? "Lait infantile"
                      : "Aliment"
                  }
                  onChange={
                    handleProductTypeChange
                  }
                  noPadding
                />

                {/* =============================================
                    MILK TYPE
                ============================================= */}

                {newProduct.type_produit ===
                  "lait" && (
                  <SelectInput
                    label="Lait infantile"
                    placeholder="Choisir le type de lait"
                    options={
                      milkTypeOptions
                    }
                    value={
                      newProduct.laitType
                    }
                    onChange={
                      handleMilkTypeChange
                    }
                    noPadding
                  />
                )}

                {/* =============================================
                    NAME + QUANTITY + UNIT
                ============================================= */}

                <div className="flex items-center bg-[#F2FAFA] border border-[#91A09F] rounded-[10px] h-[48px] overflow-hidden">
                  {/* NAME */}

                  <input
                    type="text"
                    placeholder={
                      newProduct.type_produit ===
                      "lait"
                        ? "Type de lait sélectionné"
                        : "Tapez le nom"
                    }
                    value={
                      newProduct.title
                    }
                    disabled={
                      isAddingProduct ||
                      newProduct.type_produit ===
                        "lait"
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
                    className="flex-1 h-full px-4 outline-none bg-transparent text-[15px] disabled:text-gray-500"
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
                    className="w-[45px] text-center outline-none bg-transparent text-[#4E9F8A] font-bold text-[22px]"
                  />

                  {/* UNIT */}

                  <select
                    value={
                      newProduct.type_produit ===
                      "lait"
                        ? "boîtes"
                        : newProduct.unit
                    }
                    disabled={
                      isAddingProduct ||
                      newProduct.type_produit ===
                        "lait"
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        unit:
                          e.target.value,
                      })
                    }
                    className="h-full bg-transparent outline-none cursor-pointer text-[15px] pr-3"
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

                {/* =============================================
                    GRAMMAGE
                ============================================= */}

                {newProduct.type_produit ===
                  "lait" && (
                  <div>
                    <label className="block text-[13px] font-medium text-[#202124] mb-1">
                      Grammage de la boîte *
                    </label>

                    <div className="flex items-center bg-[#F2FAFA] border border-[#91A09F] rounded-[10px] h-[48px] overflow-hidden">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex : 400"
                        value={
                          newProduct.grammage_boite
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

                            grammage_boite:
                              value,
                          });

                          setProductError(
                            ""
                          );
                        }}
                        className="w-full h-full px-4 outline-none bg-transparent text-[15px]"
                      />

                      <span className="pr-4 text-[14px] text-gray-500">
                        g
                      </span>
                    </div>
                  </div>
                )}

                {/* =============================================
                    ERROR
                ============================================= */}

                {productError && (
                  <p className="text-[#DC2626] text-[13px] mt-1 ml-1">
                    {productError}
                  </p>
                )}

                {/* =============================================
                    BUTTONS
                ============================================= */}

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
          open={
            showEditPopup
          }
          products={
            products
          }
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