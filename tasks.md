# Optimization backlog (worked off one by one; test, commit, push after each)

- [ ] 1. Quick bug fixes: Preview.tsx error-template bug (literal backticks), CSV/XLSX export asymmetry (csv exports only preview rows), duplicated download-button JSX
- [ ] 2. Remove dead `suspense: true` spreads (Taxonomy/index.tsx, Objekt/index.tsx) + unused Suspense wrappers
- [ ] 3. Unify PCO/RCO clone families (~1,500 lines): PCO/RCO index, Import components, Export filter trio (Value.tsx/Comparator.tsx); extract `useIsWriter()`/`useAllUsers` hook; fix the 11× duplicated es-toolkit cast
- [ ] 4. Add CI workflow (typecheck + vitest + eslint) on push/PR — currently no gates at all
- [ ] 5. Keyboard navigation + ARIA roles (`role="tree"`/`treeitem`, tabIndex, onKeyDown) for the virtualized Tree
- [ ] 6. apiFetch: forward AbortSignal, retry/backoff for non-react-query callers, staleTime for /user & allUsers; move token-expiry setTimeout out of authHeaders
- [ ] 7. vercel.json: `Cache-Control: immutable` for content-hashed /assets/*
- [ ] 8. Type `apiFetch<T>` / `rpc<T>`; delete GraphQL-compat shims (.nodes/.totalCount wrapping); reduce `any` count (237)
- [ ] 9. Tests for VirtualizedTree walk/render + PCO/RCO import validation (after unification)
- [ ] 10. Cleanup: sequential awaits → Promise.all (Objekt/index.tsx:59, Objekt/PC/index.tsx:40); export progress via Snackbar instead of console.log (PCO:211, RCO:222); dead code (isMobilePhone.ts, exportTooManyPropertiesAtom, identity reducer PCO Import:53); stale mobx TODO; alt_query.sql/alt_function.sql; Projektbeschreibung.tsx → markdown
