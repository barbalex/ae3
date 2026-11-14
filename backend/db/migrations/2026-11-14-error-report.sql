-- client error telemetry: the ae3 SPA (arteigenschaften.ch and artdaten.ch)
-- POSTs one row per reported browser error (src/modules/errorTelemetry.ts).
-- anon can only insert — reports are read by the operator via psql; there is
-- no API read role (org roles are per-organization application roles).
-- Canonical copy: src/sql/errorReport.sql. Notification cron:
-- backend/notify-error-reports.sh.

CREATE TABLE IF NOT EXISTS ae.error_report (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  created_at timestamptz NOT NULL DEFAULT now(),
  release text CHECK (char_length(release) <= 40),
  kind text NOT NULL CHECK (
    kind IN ('window.error', 'unhandledrejection', 'boundary', 'manual')
  ),
  message text NOT NULL CHECK (char_length(message) <= 2000),
  stack text CHECK (char_length(stack) <= 5000),
  url text CHECK (char_length(url) <= 2000),
  user_agent text CHECK (char_length(user_agent) <= 1000)
);

-- force id/created_at regardless of what the client sends
CREATE OR REPLACE FUNCTION ae.error_report_force_defaults()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.id := uuidv7();
  NEW.created_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS error_report_force_defaults ON ae.error_report;
CREATE TRIGGER error_report_force_defaults
  BEFORE INSERT ON ae.error_report
  FOR EACH ROW EXECUTE FUNCTION ae.error_report_force_defaults();

-- grantRoles.sql carries broad defaults in schema ae (select for anon, all
-- for the org_* roles): keep this table insert-only for anon and unreadable
-- through the API — RLS without a select policy guards reads on top
REVOKE ALL ON ae.error_report FROM PUBLIC, anon, org_writer, org_admin;
GRANT INSERT ON ae.error_report TO anon;

ALTER TABLE ae.error_report ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS insert_anon ON ae.error_report;
CREATE POLICY insert_anon ON ae.error_report
  FOR INSERT TO anon
  WITH CHECK (true);

-- postgrest runs with PGRST_DB_CONFIG=false and does not watch for DDL:
-- without this the new table 404s until the next cache reload/restart
NOTIFY pgrst, 'reload schema';
