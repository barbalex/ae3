# Optimization backlog (worked off one by one; test, commit, push after each)

- [x] 1. Quick bug fixes: Preview.tsx error-template bug (literal backticks), CSV/XLSX export asymmetry (csv exports only preview rows), duplicated download-button JSX
- [x] 2. Remove dead `suspense: true` spreads (Taxonomy/index.tsx, Objekt/index.tsx) + unused Suspense wrappers
- [x] 3. Unify PCO/RCO clone families — done in sub-steps 3a–3e: useUserIsWriter/useAllUsers hook (also fixed the allUsers query-key collision), es-toolkit `union`→`uniq` (removed spurious undefined elements), Collection component (PCO/RCO views), ImportCollection (PCO/RCO imports; fixed idsAreUuid(s) mismatch + RCO state mutation), FilterValue/FilterComparator (export filter trio; fixed RCO stale-value). ~2,000 lines removed, 5 latent bugs fixed.
- [ ] 4. Add CI workflow (typecheck + vitest + eslint) on push/PR — currently no gates at all
- [ ] 5. Keyboard navigation + ARIA roles (`role="tree"`/`treeitem`, tabIndex, onKeyDown) for the virtualized Tree
- [ ] 6. apiFetch: forward AbortSignal, retry/backoff for non-react-query callers, staleTime for /user & allUsers; move token-expiry setTimeout out of authHeaders
- [ ] 7. vercel.json: `Cache-Control: immutable` for content-hashed /assets/*
- [ ] 8. Type `apiFetch<T>` / `rpc<T>`; delete GraphQL-compat shims (.nodes/.totalCount wrapping); reduce `any` count (237)
- [ ] 9. Tests for VirtualizedTree walk/render + import validation (after unification)
- [ ] 10. Cleanup: sequential awaits → Promise.all (Objekt/index.tsx, Objekt/PC/index.tsx); export progress via Snackbar instead of console.log; dead code (isMobilePhone.ts, exportTooManyPropertiesAtom, identity reducer); stale mobx TODO; alt_query.sql/alt_function.sql; Projektbeschreibung.tsx → markdown
