import { useEffect, useRef } from "react";
import { listFamilles } from "@/lib/api/familles";
import { getPreCreationProduits } from "@/lib/api/distributions";
import { listVillages } from "@/lib/api/parametres";
import { saveCache } from "@/lib/offlineCache";


const MAX_PAGES = 50;

export async function fetchAllPages(fetchPageFn) {
  let page = 1;
  let allResults = [];
  let next = true;

  while (next && page <= MAX_PAGES) {
    const response = await fetchPageFn(page);
    const data = response.data;

    allResults = allResults.concat(data?.results ?? []);
    next = Boolean(data?.next);
    page += 1;
  }

  return allResults;
}

export function usePrefetchOfflineData(role) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (role !== "coordinator" && role !== "chef_coordinator") return;

    hasRun.current = true;


    fetchAllPages((page) => listFamilles({ page }))
      .then((allResults) => {
        saveCache("familles-popup", { results: allResults, next: null });
      })
      .catch(() => {
       
      });

    getPreCreationProduits()
      .then((response) => {
        saveCache("stock-produits", response.data);
      })
      .catch(() => {

      });


    fetchAllPages((page) => listVillages({ page }))
      .then((allResults) => {
        saveCache("villages", { results: allResults, next: null });
      })
      .catch(() => {
    
      });
  }, [role]);
}
