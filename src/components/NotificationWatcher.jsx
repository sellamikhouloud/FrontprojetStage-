import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api/Notifications";
import { getDashboard } from "@/lib/api/dashboard";
import { getPreferences } from "@/lib/api/Parametres";
import { playNotificationSound, setNotificationSound } from "@/lib/notificationSound";
import { useAuth } from "@/components/Providers/AuthProvider";

const SEEN_KEY = "nutrigest:seen_notif_ids";

function getSeenIds() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveSeenIds(set) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
  } catch {
    /* sessionStorage peut throw — mode privé, quota, etc. */
  }
}

function fireBrowserNotification(message, link) {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  const n = new Notification("NutriGest", { body: message, icon: "/favicon.svg" });
  if (link) {
    n.onclick = () => {
      window.focus();
      window.location.href = link;
    };
  }
}

function flattenDashboardAlertes(dashboard) {
  if (!dashboard?.alertes) return [];

  return Object.values(dashboard.alertes).flatMap(
    (categorie) => categorie?.alertes ?? []
  );
}

export default function NotificationWatcher() {
  const { user } = useAuth();
  const enabled = Boolean(user);

  // Admin : accès direct à /api/alertes/notifications/
  // Coordinator / chef_coordinator : pas d'accès, on passe par /api/dashboard/
  const isAdmin = user?.role === "admin";

const { data: preferences, isSuccess: preferencesLoaded, isError: preferencesError } = useQuery({
  queryKey: ["preferences"],
  queryFn: () => getPreferences().then((res) => res.data),
  enabled,
});

console.log("🔧 preferencesLoaded:", preferencesLoaded, "| preferencesError:", preferencesError);

  useEffect(() => {
    if (preferences?.sonnerie_notifications) {
      setNotificationSound(preferences.sonnerie_notifications);
    }
  }, [preferences?.sonnerie_notifications]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);


    const {
    data: notifications = [],
    isError: notificationsError,
    error: notificationsErrorObj,
  } = useQuery({
    queryKey: ["notifications-watcher", isAdmin],
    queryFn: () => {
      console.log("📡 FETCH déclenché | isAdmin:", isAdmin, "| role:", user?.role);

      if (isAdmin) {
        return getNotifications().then((res) => {
          const raw = res.data;
          return Array.isArray(raw) ? raw : raw?.results ?? [];
        });
      }

      return getDashboard().then((res) => {
        console.log("📊 Dashboard brut reçu:", res.data);
        const flat = flattenDashboardAlertes(res.data);
        console.log("📊 Alertes aplaties:", flat);
        return flat;
      });
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    enabled: enabled && preferencesLoaded,
  });

  console.log(
    "🔍 État query | enabled:", enabled,
    "| preferencesLoaded:", preferencesLoaded,
    "| notificationsError:", notificationsError,
    notificationsErrorObj
  );


  const initializedRef = useRef(false);

   useEffect(() => {
    const list = Array.isArray(notifications) ? notifications : [];

  console.log("📋 Notifications reçues:", list);

    const seenIds = getSeenIds();

    console.log("👁️ IDs déjà vus:", [...seenIds]);  

    if (!initializedRef.current) {
      initializedRef.current = true;
      list.filter((n) => !n.est_resolue).forEach((n) => seenIds.add(n.id));
      saveSeenIds(seenIds);
      return;
    }

    const newOnes = list.filter((n) => !n.est_resolue && !seenIds.has(n.id));

    console.log("🆕 Nouvelles notifications calculées:", newOnes);

    if (newOnes.length > 0) {
    
  
      playNotificationSound();
      newOnes.forEach((n) => {
        if (document.visibilityState === "hidden" || !document.hasFocus()) {
          fireBrowserNotification(n.message, `/notifications`);
        }
        seenIds.add(n.id);
      });
      saveSeenIds(seenIds);
    }
  }, [notifications]);

  return null;
}