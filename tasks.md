---
---

---

---

---

---

---

Deploying cuts production over from PostGraphile to PostgREST directly — no parallel serving. On the server, in backend/:

1. apply db/migrations/2026-10-27-postgrest-auth.sql to the production db: `docker exec -i ae_db psql -U postgres -d ae < db/migrations/2026-10-27-postgrest-auth.sql` (function replacements only, backward compatible — safe while PostGraphile still runs)
2. check the jwt secret is at least 32 chars and matches JWT_SECRET in .env: `docker exec ae_db psql -U postgres -d ae -c "select length(current_setting('app.jwt_secret'));"` (a dollar sign in the secret must be escaped as $$ in .env)
3. `docker compose up -d --remove-orphans` — starts ae_postgrest, recreates caddy with only the /postgrest route, stops and removes ae_graphql. From here the old GraphQL frontend is dead until step 4.
4. build and deploy the new frontend (npm ci && npm run build, upload dist/)
5. verify: app loads, tree renders, login works, an export runs; https://api.arteigenschaften.ch/postgrest/taxonomy?select=id&limit=1 returns a row; /graphql returns 404.

Rollback: checkout the previous commit on the server, `docker compose up -d graphql caddy` (the image is still cached), redeploy the old frontend. No data rollback needed — the migration only replaced functions.

---

Known consequence of the PostgREST cutover: vermehrung's Hasura remote schema (https://api.arteigenschaften.ch/graphql) breaks; its postgres_fdw access is unaffected. Clean path forward for vermehrung: serve its existing fdw foreign tables as native Hasura tables. Also: users with a PWA-cached old frontend need one reload to get the new build.

---

lets add a dark mode and a way to switch while per default using system settings

---

'Im GBIF suchen' seems not to work. url to call: https://www.gbif.org/taxon/search?q=test

---

click on nav tree rows does not immediately close them if a lower level element is active - but it should (First the lower level is closed). used to be same in apf2, was solved a few months ago. Please have a look how it is solved in apf2 and apply it here too
