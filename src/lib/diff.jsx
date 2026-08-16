export function diffPatch(baseline, current) {
const patch = {};
for (const key of Object.keys(baseline)) {
const a = baseline[key];
const b = current[key];
// A new file always counts as a change.
if (b instanceof File) { patch[key] = b; continue; }

// Treat empty string and null the same way.
const na = a == null || a === "" ? null : a;
const nb = b == null || b === "" ? null : b;

// Compare arrays by their contents.
if (Array.isArray(na) && Array.isArray(nb)) {
const same = na.length === nb.length && na.every((x, i) => x === nb[i]);
if (!same) patch[key] = b;
continue;
}
if (na !== nb) patch[key] = b;
}
return patch;
}
// True if nothing changed.
export function isEmptyPatch(patch) {
return Object.keys(patch).length === 0;
}