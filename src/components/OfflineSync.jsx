import { useEffect, useCallback, useState } from "react";
import { flush } from "@/lib/offlineQueue";
import { useAuth } from "@/components/Providers/AuthProvider";
export default function OfflineSync() {
    const { user } = useAuth();
    const [syncing, setSyncing] = useState(false);
    // Wrap flush() so two flushes never run at once. Without this guard, the
    // 60s interval could fire while the online-event flush is still in
    // flight. Backend idempotency keeps data correct either way, but it's
    // wasted work — better to serialize.
    const tryFlush = useCallback(async () => {
        if (syncing || !user) return;
        setSyncing(true);
        try {
            const { flushed, remaining, idempotentHits } = await flush();
            if (flushed > 0) {
                console.log(
                    `[offline] synced ${flushed} record(s), ` +
                    `${idempotentHits} were already on server, ` +
                    `${remaining} remaining in queue`,
                );
            }
        } finally {
            setSyncing(false);
        }
    }, [syncing, user]);
    // Fire on 'online' event
    useEffect(() => {
        const onOnline = () => tryFlush();
        window.addEventListener("online", onOnline);
        return () => window.removeEventListener("online", onOnline);
    }, [tryFlush]);
    // Fallback: try every 60 seconds regardless
    useEffect(() => {
        const id = setInterval(tryFlush, 60000);
        return () => clearInterval(id);
    }, [tryFlush]);
    // Try once immediately on mount — flushes anything left over from a
    // previous session.
    useEffect(() => {
        if (user) tryFlush();
    }, [user, tryFlush]);
    return null;
}