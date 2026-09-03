import { useEffect, useRef } from "react";
import { listFamilles } from "@/lib/api/familles";
import { getPreCreationProduits } from "@/lib/api/distributions";
import { listVillages } from "@/lib/api/parametres";
import { saveCache } from "@/lib/offlineCache";

/**
 * Warms the offline cache as soon as the coordinator lands on their
 * dashboard, so family search and stock lookups still have a "last
 * known good copy" to fall back on if connectivity drops later in the
 * day. Runs once per mount, only for roles that actually create
 * records in the field (coordinator, chef_coordinator) — plain admins
 * aren't expected to work offline, per the guide's original scope.
 *
 * This is fire-and-forget: the dashboard never waits on it, and any
 * failure (e.g. already offline on a fresh login) is silent — whatever
 * cache already exists from a previous session is simply left alone.
 */
export function usePrefetchOfflineData(role) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (role !== "coordinator" && role !== "chef_coordinator") return;

    hasRun.current = true;

    // Family list (page 1, no filters) — saved under BOTH cache key
    // formats actually consumed elsewhere:
    //   - "familles-page-1": read by FamiliesPage's per-page cache
    //     fallback (page 1 is what a fresh, unfiltered visit needs).
    //   - "familles-popup": read by the family-search popup fallback
    //     used in AjoutVisite / AjoutZakat.
    // One fetch here primes both, so a coordinator who never manually
    // opens the family list page still has page 1 ready offline.
    listFamilles()
      .then((response) => {
        saveCache("familles-page-1", response.data);
        saveCache("familles-popup", response.data);
      })
      .catch(() => {
        // Offline already, or request failed — leave existing cache as-is.
      });

    // Global stock/products list — not yet consumed anywhere (see
    // AjoutDistribution.jsx, which still only reads per-family stock).
    getPreCreationProduits()
      .then((response) => {
        saveCache("stock-produits", response.data);
      })
      .catch(() => {
        // Same — silent failure, existing cache (if any) stays.
      });

    // Villages list — same cache key FamiliesPage's own villages query
    // already reads from (loadCache("villages")), so this prefetch
    // primes it before the coordinator ever opens that page.
    listVillages()
      .then((response) => {
        saveCache("villages", response.data);
      })
      .catch(() => {
        // Same — silent failure, existing cache (if any) stays.
      });
  }, [role]);
}
