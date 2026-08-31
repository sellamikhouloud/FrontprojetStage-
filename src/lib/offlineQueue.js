import { get, set, del, entries } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";
import api from "@/lib/axios";

// idb-keyval uses one default IndexedDB store called "keyval-store". Every
// call below reads/writes to that same store. One entry per queued request,
// keyed by the record's client_id.
//
// Value shape: { endpoint, payload, createdAt }
// Failed items get a "failed:" prefix on their key so the flush loop skips
// them but the UI can still list them for review.

/** Add a record to the offline queue. Returns the generated client_id. */
export async function enqueue(endpoint, payload) {
  const client_id = uuidv4();
  await set(client_id, {
    endpoint,
    payload: { ...payload, client_id },
    createdAt: Date.now(),
  });
  return client_id;
}

/** Try to POST every item in the queue. Called on 'online' + 60s interval. */
export async function flush() {
  const items = await entries();
  let flushed = 0;
  let idempotentHits = 0;

  for (const [client_id, item] of items) {
    if (String(client_id).startsWith("failed:")) continue;

    try {
      const response = await api.post(item.endpoint, item.payload);

      // 201 = created for the first time. 200 = server already had this
      // client_id (idempotent hit). Either way, clear the queue entry.
      if (response.status === 200 || response.status === 201) {
        await del(client_id);
        flushed++;
        if (response.status === 200) idempotentHits++;
      }
    } catch (err) {
      if (err.response) {
        const s = err.response.status;
        if (s >= 400 && s < 500) {
          // 4xx = payload itself is bad. Retrying won't help — move to
          // a "failed" bucket so the queue can drain past it.
          await set(`failed:${client_id}`, {
            ...item,
            error: err.response.data,
            failedAt: Date.now(),
          });
          await del(client_id);
        }
        // 5xx = server error, might be transient. Leave in queue.
      }
      // No response at all = network is genuinely down. Leave in queue.
    }
  }

  const remaining = (await entries()).filter(
    ([k]) => !String(k).startsWith("failed:"),
  ).length;

  return { flushed, remaining, idempotentHits };
}

/** List pending items — excludes failed ones. */
export async function listPending() {
  const items = await entries();
  return items
    .filter(([k]) => !String(k).startsWith("failed:"))
    .map(([client_id, item]) => ({ client_id, ...item }));
}

/** List failed items, for surfacing to the coordinator. */
export async function listFailed() {
  const items = await entries();
  return items
    .filter(([k]) => String(k).startsWith("failed:"))
    .map(([key, item]) => ({ client_id: key.slice(7), ...item }));
}

/** Manually delete a failed item ("discard" action in the UI). */
export async function discardFailed(client_id) {
  await del(`failed:${client_id}`);
}