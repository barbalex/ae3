---
context menu use in nav tree: is it really useful? Could we move to the form (headers)?
---

---

right click on 'Arten' in the nav tree should open a context menu when logged in. does not happen. seems that no context menus open

---

logging in: when ui navigates to home, the menu switches immediately to 'Login abgelaufen'. Maybe that is the reason context menus dont open?

---

http://localhost:5174/Export checking 'Arten' leads to: 'Fehler beim Laden der Taxonomien: apiFetch is not defined'

---

---

What I recommend before deploying: run the dev app (npm run dev — backend containers are already up) and manually exercise one flow per domain I converted — login, a tree context-menu create/delete, an object edit, a PCO/RCO import, and an xlsx export with filters. The unit and e2e suites cover the spine, but the mutation-heavy screens (imports, exports with composite filters) deserve one human pass. Deploying means docker compose up -d postgrest caddy on the server with the updated compose files — the frontend can deploy independently since PostGraphile still serves the old endpoint in parallel.

---

vermehrung accesses ae3 two ways: postgres_fdw straight into ae3's Postgres (unaffected by any of this) and a Hasura remote schema pointing at https://api.arteigenschaften.ch/graphql. Hasura remote schemas only speak GraphQL, so that one cannot be pointed at PostgREST — it keeps working because PostGraphile stays running, which matches your "not now" decision. When you eventually migrate it, the clean path is serving vermehrung through its existing fdw foreign tables as native Hasura tables, after which PostGraphile can be retired.

---

dark and light mode

---

'Im GBIF suchen' seems not to work. way to go: https://www.gbif.org/taxon/search?q=test
