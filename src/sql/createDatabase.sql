CREATE DATABASE ae ENCODING 'UTF8';

-- We put things inside the auth schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.
CREATE EXTENSION IF NOT EXISTS "postgres_fdw";

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE USER fdw_user WITH encrypted PASSWORD 'secret';

GRANT SELECT ON TABLE ae.v_vermehrung_arten TO fdw_user;

GRANT SELECT ON TABLE ae.v_apflora_lr_delarze TO fdw_user;

GRANT SELECT ON TABLE ae.v_apflora_taxonomies TO fdw_user;

CREATE ROLE anon;

CREATE ROLE authenticator WITH LOGIN PASSWORD 'secret' noinherit;

CREATE ROLE org_admin;

CREATE ROLE org_writer;

-- restore from backup, then:
-- run this once with real secret
ALTER DATABASE ae SET "app.jwt_secret" TO 'secret';

ALTER USER "authenticator" WITH PASSWORD 'secret';

-- dont run these, they come with restoring ae:
CREATE SCHEMA IF NOT EXISTS ae;

CREATE SCHEMA IF NOT EXISTS auth;

-- once: alter TYPE auth.jwt_token add attribute exp integer;
