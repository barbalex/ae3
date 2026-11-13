# Optimization backlog — complete ✅

All 10 items done (Nov 13, 2026), each tested, committed and pushed separately:

- [x] 1. Quick bug fixes: Preview.tsx error-template bug, CSV/XLSX export asymmetry, duplicated download-button JSX
- [x] 2. Removed dead `suspense: true` spreads + unused Suspense wrappers
- [x] 3. Unified PCO/RCO clone families (useUserIsWriter hook, uniq fix, Collection, ImportCollection, FilterValue/FilterComparator) — ~2,000 lines removed, 5 latent bugs fixed
- [x] 4. CI workflow (typecheck + vitest + eslint) on push/PR: .github/workflows/ci.yml
- [x] 5. Keyboard navigation + ARIA roles for the tree
- [x] 6. apiFetch: transient-GET retry with backoff, abort-signal forwarding, guarded login expiry, 30s staleTime
- [x] 7. vercel.json: immutable cache headers for /assets/*
- [x] 8. apiFetch<T>/rpc<T> generics; GraphQL-compat shims removed; idIsReferenced now also counts relations
- [x] 9. Import validation extracted to pure validateImportData with 9 unit tests
- [x] 10. Cleanup: Promise.all for parent chains, snackbar for export errors, dead code removed (isMobilePhone, exportTooManyPropertiesAtom, alt SQL), console.error instead of console.log for swallowed errors

Not done (deliberately): i18n centralization (product is de-CH only), Projektbeschreibung.tsx → markdown, singleColumnViewAtom TODO (product decision), e2e in CI (needs docker backend).
