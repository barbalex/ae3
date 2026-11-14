-- Dev-only test users for testing the three application roles
-- (see CLAUDE.md "Testing user roles"). Runs automatically when the
-- volume is created (init scripts only run on first start, after
-- 02_restore.sh restored the schema). On an existing volume apply
-- manually:
--   docker exec -i ae_db psql -U postgres -d ae < backend-dev/db/init/05_test_users.sql
--
-- NEVER copy this file to backend/ (production): these passwords are
-- public in the repo. Production users come from the restored backup.
--
-- ae.user.role must be an existing DATABASE role (checked by the
-- ensure_user_role_exists trigger): the JWT carries it and PostgREST
-- switches to it. The application-level roles live on
-- ae.organization_user.role (FK into ae.role) instead.
--
-- Idempotency uses DELETE + INSERT, not ON CONFLICT DO UPDATE: the
-- auth.encrypt_pass() BEFORE INSERT trigger hashes the proposed row
-- BEFORE conflict detection, so EXCLUDED.pass in DO UPDATE would
-- already be a hash - and the BEFORE UPDATE trigger would hash it
-- again, breaking the password on every re-run.
-- Plaintext passwords are hashed automatically by that same trigger.

DELETE FROM ae.organization_user
WHERE organization_id = 'a0000000-0000-0000-0000-000000000004'
   OR user_id IN (
     'a0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000003');
DELETE FROM ae.organization WHERE id = 'a0000000-0000-0000-0000-000000000004';
DELETE FROM ae.user
WHERE id IN (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003');

INSERT INTO ae.user (id, name, email, role, pass) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'test-org-admin', 'test-org-admin@example.org', 'org_admin', 'ae3-test-pass'),
  ('a0000000-0000-0000-0000-000000000002', 'test-taxonomy-writer', 'test-taxonomy-writer@example.org', 'org_writer', 'ae3-test-pass'),
  ('a0000000-0000-0000-0000-000000000003', 'test-collection-writer', 'test-collection-writer@example.org', 'org_writer', 'ae3-test-pass');

INSERT INTO ae.organization (id, name, contact) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'Test-Organisation ae3', 'a0000000-0000-0000-0000-000000000001');

INSERT INTO ae.organization_user (organization_id, user_id, role) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'orgAdmin'),
  ('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'orgTaxonomyWriter'),
  ('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'orgCollectionWriter');
